import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import type { Stripe } from 'stripe';
import app from './index.js'; // Adjust this import based on your app location
import { User, Token, IUser } from '@librechat/api-keys';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.ATLAS_URI = mongoUri;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collections before each test
  await User.deleteMany({});
  await Token.deleteMany({});
});

describe('Newsletter Signup Tests', () => {
  // Mock user data
  const dummyUser: IUser = {
    _id: '645f9c3c1234567890abcdef',
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://example.com/profile.jpg',
    newsletterActive: 1,
    usage: 50,
    subscription: {
      id: 'sub_1234567890',
      status: 'active' as Stripe.Subscription.Status,
      planId: 'plan_premium',
      priceId: 'price_1234567890',
      currentPeriodEnd: new Date('2024-12-31'),
      cancelAtPeriodEnd: false,
      metadata: {
        feature: 'premium',
        tier: 'business',
      },
    },
    stripeCustomerId: 'cus_1234567890',
    agreements: {
      termsOfService: {
        agreed: true,
        timestamp: new Date('2023-01-01'),
        version: '1.0',
        methodOfAgreement: 'website',
        consentText: 'I agree to the terms of service',
      },
      privacyPolicy: {
        agreed: true,
        timestamp: new Date('2023-01-01'),
        version: '1.0',
        methodOfAgreement: 'website',
        consentText: 'I agree to the privacy policy',
      },
      refundPolicy: {
        agreed: true,
        timestamp: new Date('2023-01-01'),
        version: '1.0',
        methodOfAgreement: 'website',
        consentText: 'I agree to the refund policy',
      },
    },
    lastReset: new Date('2023-12-01'),
    save: async function () {
      return this;
    },
  };

  // To insert the dummy data using Mongoose:
  // Method 1: Insert many users at once
  const user = new User(dummyUser);
  (async (): Promise<void> => {
    await user.save();
    // ... rest of your code
  })();
  // Method 2: Insert users one by one
  // dummyUsers.forEach(userData => {
  //   const user = new User(userData);
  //   user.save()
  //     .then(doc => console.log('User inserted successfully:', doc))
  //     .catch(err => console.error('Error inserting user:', err));
  // });
  // Test the newsletter signup endpoint
  it('should successfully sign up for newsletter and create token', async () => {
    // First create a user in the database
    // Make the newsletter signup request
    await request(app)
      .post('/api/newsletter/signup')
      .send({ email: dummyUser.email })
      .expect(200);

    // Verify user newsletterActive status
    const updatedUser = await User.findById(user._id);
    expect(updatedUser?.newsletterActive).toBe(-1);

    // Verify token creation
    const token = await Token.findOne({
      email: dummyUser.email,
      userId: dummyUser._id,
    });

    expect(token).toBeTruthy();
    expect(token?.email).toBe(dummyUser.email);
    expect(token?.userId.toString()).toBe(dummyUser._id.toString());
  });
});

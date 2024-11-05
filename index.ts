import express, { Request, Response } from 'express';
import { createSub, getSubByEmail, deleteSubByEmail } from './subService';
import { randomBytes } from 'crypto';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import {rateLimit} from 'express-rate-limit';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

const limiter = rateLimit({
  windowMs: 5 * 1000, //5 Second
  max: 5,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.post('/api/newsletter/signup', async (req: Request, res: Response) => {
  let subEmail: string;
  try {
    subEmail = req.body.email.trim();
  } catch {
    res.status(422).json({
      success: false,
      message:
        'Invalid input: expected JSON in request body with key-value of email string',
    });
    return; //End response sent
  }
  const token: string = randomBytes(32).toString('hex');
  //Check if sub exits
  if (!isValidEmail(subEmail)) {
    res.status(422).json({
      success: false,
      message: 'Invalid Input: Invalid Email!',
    });
    return;
  }
  const checkUser = await getSubByEmail(subEmail);
  if (checkUser) {
    //Email already exists
    if (checkUser.isConfirmed) {
      //Email is confirmed
      res.status(422).json({
        success: false,
        message: 'Already Subscribed!',
      });
      return;
    } else {
      //Email is not confirmed
      res.status(404).json({
        success: false,
        message: 'Not confirmed, please check your email',
      });
      return;
    }
  }
  const newUser = await createSub({
    email: subEmail,
    isConfirmed: false,
    confirmationToken: token,
    createdAt: Date.now(),
    confirmedAt: undefined,
  });
  if (!newUser) {
    //Unable to add
    res.status(500).json({
      success: false,
      message: 'Failure: Did not add email to database',
    });
    return;
  }
  const success = await sendEmail(subEmail, token);
  if (success) {
    res.status(200).json({
      success: true,
      message: 'Success: confirmation email sent.',
    });
    return;
  } else {
    res.status(500).json({
      success: false,
      message: 'Failure: Sending confirmation email failed.',
    });
    return;
  }
});
app.delete('/api/newsletter/signup', async (req: Request, res: Response) => {
  let unsubEmail;
  try {
    unsubEmail = req.body.email.trim();
  } catch {
    res.status(422).json({
      success: false,
      message:
        'Invalid input: expected JSON in request body with key-value of email string.',
    });
    return; //End response sent
  }
  const result = await deleteSubByEmail(unsubEmail);
  if (!result || !result.acknowledged) {
    res.status(400).json({
      success: false,
      message: `Failed to delete email: ${unsubEmail}, not in database `,
    });
    return;
  }
  res.status(200).json({
    success: true,
    message: `Successfully deleted email: ${unsubEmail}`,
  });
});
async function sendEmail(email: string, token: string): Promise<boolean> {
  try {
    await mg.messages.create(process.env.MAIL_DOMAIN!, {
      from: `No Reply <${process.env.SENDER_EMAIL}>`,
      to: [email],
      subject: 'Confirmation Code',
      text: 'The Confirmation Link:',
      html: `
        <a href="${process.env.CONFIRM_URL}?token=GENERATED_TOKEN${token}" id="simple-button">Confirm Email</a>
<style>
#simple-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
}

#simple-button:hover {
    background-color: #45a049;
}
</style>`,
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
  return true;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

export default app;

import mongoose from 'mongoose';
import { Token } from './subModel';

const uri =
  'mongodb+srv://connorfinn:StrangeChew22@cluster0.8n9oscj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function main(): Promise<void> {
  await mongoose.connect(uri!);

  const id = new mongoose.Types.ObjectId();
  const newToken = await Token.create({
    userId: id,
    email: 'email2@email.com',
    token: 'blahblah1',
  });

  const savedToken = await newToken.save();
  console.log(savedToken);
}

main();

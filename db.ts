// db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_URI;

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(uri!);
}

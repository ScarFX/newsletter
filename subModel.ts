// userModel.ts
import { ObjectId } from 'mongodb';

export interface Sub {
  _id?: ObjectId;
  email: string;
  isConfirmed: boolean;
  confirmationToken: string;
  createdAt: number;
  confirmedAt?: number;
}

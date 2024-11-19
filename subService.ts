// userService.ts
import { IUser, User, Token, IToken } from '@librechat/api-keys';
import { connectToDatabase } from './db.js';
import { DeleteResult } from 'mongoose';

connectToDatabase(); // Ensure database connection is established

export async function getSubByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email: email }).exec();
}

export async function deleteSubByEmail(email: string): Promise<boolean> {
  const result: DeleteResult = await Token.deleteOne({ email: email });
  if (!result.acknowledged) {
    return false; //failed to delete token
  }
  await User.updateOne({ email: email }, { $unset: { active: 1 } });
  return result.deletedCount > 0;
}

export async function updateSubByEmail(
  email: string,
  confirmed: boolean,
  confirmationToken: string
): Promise<boolean> {
  let active: number;
  if (confirmed) {
    //confirmed, token document ttl
    active = Math.floor(Date.now() / 1000);
  } else {
    //not confirmed create Token document
    active = -1;
    createToken(email, confirmationToken);
  }
  const result = await User.updateOne(
    { email: email },
    { $set: { active: active } }
  );

  return result.modifiedCount > 0;
}

async function createToken(
  email: string,
  confirmationToken: string
): Promise<IToken> {
  const user = await getSubByEmail(email);
  const token = new Token({
    userId: user!._id,
    email: email,
    token: confirmationToken,
  });
  return await token.save();
}

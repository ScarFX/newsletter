// userService.ts
import { IUser, User, IMarketing } from '@librechat/api-keys';
import { connectToDatabase } from './db';

connectToDatabase(); // Ensure database connection is established

export async function getSubByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email: email }).exec();
}

export async function deleteSubByEmail(email: string): Promise<boolean> {
  const result = await User.deleteOne({ email: email });
  return result.deletedCount > 0;
}

export async function updateSubByEmail(
  email: string,
  confirmed: boolean,
  confirmationToken: string
): Promise<boolean> {
  let marketing: IMarketing;
  if (confirmed) {
    //confirmed
    marketing = {
      active: Math.floor(Date.now() / 1000),
      confirmationToken: confirmationToken,
    };
  } else {
    //not confirmed
    marketing = {
      active: -1,
      confirmationToken: confirmationToken,
    };
  }
  const result = await User.updateOne(
    { email: email },
    { $set: { marketing: marketing } }
  );
  return result.modifiedCount > 0;
}

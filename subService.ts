// userService.ts
import { Db, DeleteResult, ObjectId } from 'mongodb';
import { Sub } from './subModel';
import { connectToDatabase } from './db';

let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

export async function createSub(sub: Sub): Promise<Sub> {
  const db = await getDatabase();
  const result = await db.collection<Sub>('subscribers').insertOne(sub);
  return { ...sub, _id: result.insertedId };
}

export async function getSubById(subId: string): Promise<Sub | null> {
  const db = await getDatabase();
  return db
    .collection<Sub>('subscribers')
    .findOne({ _id: new ObjectId(subId) });
}

export async function getSubByEmail(email: string): Promise<Sub | null> {
  const db = await getDatabase();
  return db.collection<Sub>('subscribers').findOne({ email: email });
}

export async function deleteSubByEmail(
  email: string
): Promise<DeleteResult | null> {
  const db = await getDatabase();
  return db.collection<Sub>('subscribers').deleteOne({ email: email });
}

export async function updateSub(
  subId: string,
  updateData: Partial<Sub>
): Promise<boolean> {
  const db = await getDatabase();
  const result = await db
    .collection<Sub>('subscribers')
    .updateOne({ _id: new ObjectId(subId) }, { $set: updateData });
  return result.modifiedCount > 0;
}

export async function deleteSub(subId: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db
    .collection<Sub>('subscribers')
    .deleteOne({ _id: new ObjectId(subId) });
  return result.deletedCount > 0;
}

// userModel.ts
import mongoose, { Model, Types, Schema } from 'mongoose';
interface IToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  email: {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 });

export const Token: Model<IToken> = mongoose.model<IToken>(
  'Token',
  tokenSchema
);

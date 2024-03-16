import * as mongoose from 'mongoose';
import { toJSON } from './plugins';

export interface IToken extends mongoose.Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      index: true,
    },
    refreshTokenExpires: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Change here
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose document to JSON
// @ts-ignore
tokenSchema.plugin(toJSON);

/**
 * Token Model
 */
const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;

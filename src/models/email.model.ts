import * as mongoose from 'mongoose';
import { toJSON } from './plugins';
import validator from 'validator';
import lang from '../utils/language/english'
export interface IToken extends mongoose.Document {
    token: string;
    user: mongoose.Types.ObjectId;
    type: string;
    expires: Date;
    blacklisted: boolean;
}

const emailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: lang.common.invalidEmail,
            },
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add plugin that converts mongoose document to JSON
// @ts-ignore
emailSchema.plugin(toJSON);

/**
 * Token Model
 */
const Email = mongoose.model<IToken>('Email', emailSchema);

export default Email;

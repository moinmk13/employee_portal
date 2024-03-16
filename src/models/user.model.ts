import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { roles } from '../config/roles';

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  isPasswordMatch(password: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
// @ts-ignore
userSchema.plugin(toJSON);
//@ts-ignore
userSchema.plugin(paginate);

// @ts-ignore
userSchema.statics.isEmailTaken = async function (this: UserModel, email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (this: UserDocument, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;

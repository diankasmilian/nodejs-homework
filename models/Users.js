import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleSaveError, runValidateAtUpdate } from './hooks.js';

const planList = ['starter', 'pro', 'business'];

const userSchema = new Schema(
  {
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    subscription: {
      type: String,
      enum: planList,
      default: 'starter',
    },
    token: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    avatarURL: {
      type: String,
    }
  },
  {
    versionKey: false,
  }
);

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidateAtUpdate)
userSchema.post('findOneAndUpdate', handleSaveError)

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string()
    .valid(...planList)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...planList).required()
})

const User = model('user', userSchema)

export default User;

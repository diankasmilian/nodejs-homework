import User from "../models/Users.js";
import { HttpErrors, sendEmail } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import { nanoid } from "nanoid";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import gravatar from 'gravatar'
import fs from 'fs/promises'
import path from "path";
import Jimp from 'jimp'

const avatarPath = path.resolve("public", "avatars");

dotenv.config()

const {JWT_SECRET, BASE_URL} = process.env;

const register = async (req, res) => {
   const {email, password} = req.body;
   const avatar = gravatar.url(email, {s: '250'});
   const user = await User.findOne({email})

   if (user) {
      throw HttpErrors(409, 'Email already in use')
   }

      const hashPassword = await bcrypt.hash(password, 10)
      const verificationToken = nanoid();

const newUser = await User.create({...req.body, avatarURL: avatar, password: hashPassword, verificationToken})

const verifyEmail = {
   to: email,
   subject: "Verify email",
   html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`
}

await sendEmail(verifyEmail)

res.status(201).json({
   email: newUser.email,
   password: newUser.password,
   subscription: newUser.subscription,
   avatarURL: newUser.avatarURL,
})
}

const login = async (req, res) => {
   const {email, password} = req.body;
   const user = await User.findOne({email})

   if (!user) {
      throw HttpErrors(401, 'Email or password is wrong')
   }

   const comparePassword = await bcrypt.compare(password, user.password)
   if (!comparePassword) {
      throw HttpErrors(401, 'Email or password is wrong')
   }

   if(!user.verify) {
      throw HttpErrors(404, 'User not found')
   }

   const {_id: id} = user;

   const payload ={
      id
   }

   const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
   await User.findByIdAndUpdate(id, {token})

   res.json({
       token,
       user: {
         email: user.email,
         subscription: user.subscription
       }
   })
}

const getCurrent = async (req, res) => {
const {email, subscription} = req.user;

res.json({
   email,
   subscription
})
}

const logout = async (req, res) => {
const {_id} = req.user;
await User.findByIdAndUpdate(_id, {token: ""})

res.status(204)
}

const updateSubscription = async (req, res) => {
   const {_id} = req.user;
   const result = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
   if (!result) {
      throw HttpErrors(404, `Not found`);
    }
    res.json(result);
}

const updateAvatar = async (req, res) => {
   const {_id} = req.user;
   const {path: oldPath, filename} = req.file;
   const newAvatar = await Jimp.read(oldPath);
   await newAvatar.resize(250, 250);

    const newPath = path.join(avatarPath, filename);
    await newAvatar.writeAsync(newPath);
    await fs.unlink(oldPath);
    const avatar = path.join("avatars", filename);

   const result = await User.findByIdAndUpdate(_id, {...req.body, avatarURL: avatar}, {new: true, runValidators: true})
   if (!result) {
      throw HttpErrors(401, `Not authorized`);
    }
    res.json({
      avatarURL: result.avatarURL
    });
}

const verify = async (req, res) => {
   const {verificationToken} = req.params;
   const user = await User.findOne({verificationToken})
   if(!user) {
      throw HttpErrors(404, `Not found`);
   }

   await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})

   res.json({
      message: 'Verification successful'
   })
}

const resendVerifyEmail = async (req, res) => {
const {email} = req.body;
const user = await User.findOne({email})

if(!user) {
   throw HttpErrors(404, `Not found`);
}
if(user.verify) {
   throw HttpErrors(400, `Verification has already been passed`);
}

const verifyEmail = {
   to: email,
   subject: "Verify email",
   html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
}

await sendEmail(verifyEmail)

res.json({
   message: "Verify email resend success"
})

}

export default {
   register: ctrlWrapper(register),
   login: ctrlWrapper(login),
   getCurrent: ctrlWrapper(getCurrent),
   logout: ctrlWrapper(logout),
   updateSubscription: ctrlWrapper(updateSubscription),
   updateAvatar: ctrlWrapper(updateAvatar),
   verify: ctrlWrapper(verify),
   resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}
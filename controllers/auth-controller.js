import User from "../models/Users.js";
import { HttpErrors, cloudinary } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import gravatar from 'gravatar'
import fs from 'fs/promises'
import path from "path";
import Jimp from 'jimp'

const avatarPath = path.resolve("public", "avatars");

dotenv.config()

const {JWT_SECRET} = process.env;

const register = async (req, res) => {
   const {email, password} = req.body;
   const avatar = gravatar.url(email, {s: '250'});
   const user = await User.findOne({email})

   if (user) {
      throw HttpErrors(409, 'Email already in use')
   }

      const hashPassword = await bcrypt.hash(password, 10)

const newUser = await User.create({...req.body, avatarURL: avatar, password: hashPassword})

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
   const result = await User.findByIdAndUpdate(_id, req.body, {new: true})
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

   const result = await User.findByIdAndUpdate(_id, {...req.body, avatarURL: avatar}, {new: true})
   if (!result) {
      throw HttpErrors(401, `Not authorized`);
    }
    res.json({
      avatarURL: result.avatarURL
    });
}

export default {
   register: ctrlWrapper(register),
   login: ctrlWrapper(login),
   getCurrent: ctrlWrapper(getCurrent),
   logout: ctrlWrapper(logout),
   updateSubscription: ctrlWrapper(updateSubscription),
   updateAvatar: ctrlWrapper(updateAvatar)
}
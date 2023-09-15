import User from "../models/Users.js";
import { HttpErrors } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const {JWT_SECRET} = process.env;

const register = async (req, res) => {
   const {email, password} = req.body;
   const user = await User.findOne({email})

   if (user) {
      throw HttpErrors(409, 'Email already in use')
   }

      const hashPassword = await bcrypt.hash(password, 10)

const newUser = await User.create({...req.body, password: hashPassword})

res.status(201).json({
   email: newUser.email,
   password: newUser.password,
   subscription: newUser.subscription
})
}

const login = async (req, res) => {
   const {email, password} = req.body;
   const user = await User.findOne({email})

   if (!user) {
      throw HttpErrors(401, 'Email or password invalid')
   }

   const comparePassword = await bcrypt.compare(password, user.password)
   if (!comparePassword) {
      throw HttpErrors(401, 'Email or password invalid')
   }

   const {_id: id} = user;

   const payload ={
      id
   }

   const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
   await User.findByIdAndUpdate(id, {token})

   res.json({
       token,
   })
}

const getCurrent = async (req, res) => {
const {email} = req.user;

res.json({
   email
})
}

const logout = async (req, res) => {
const {_id} = req.user;
await User.findByIdAndUpdate(_id, {token: ""})

res.status(204)
}

export default {
   register: ctrlWrapper(register),
   login: ctrlWrapper(login),
   getCurrent: ctrlWrapper(getCurrent),
   logout: ctrlWrapper(logout)
}
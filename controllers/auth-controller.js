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

   const payload ={
      id: user._id
   }

   const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});

   res.json({
       token,
   })
}

export default {
   register: ctrlWrapper(register),
   login: ctrlWrapper(login)
}
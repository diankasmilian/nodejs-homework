import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpErrors } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import User from '../models/Users.js';

dotenv.config();

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = ""} = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
   throw HttpErrors(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpErrors(401, "Not authorized")
    }
    req.user = user;
    next();
  } catch (error) {
   throw HttpErrors(401, "Not authorized")
  }
};

export default ctrlWrapper(authenticate);

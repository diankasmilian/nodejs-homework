import { isValidObjectId } from 'mongoose';
import {HttpErrors} from '../helpers/index.js'

const isValidId = (req, res, next) => {
  const contactId = req.params.contactId;
  if (!isValidObjectId(contactId)) {
    return next(HttpErrors(404, `${contactId} not valid id`));
  }
  next();
};

export default isValidId;

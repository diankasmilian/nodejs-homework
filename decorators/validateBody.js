import { HttpErrors } from '../helpers/index.js';

const validateBody = (schema) => {
  const func = async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpErrors(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;

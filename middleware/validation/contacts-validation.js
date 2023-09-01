import { contactSchema } from '../../schemas/index.js';
import { validateBody } from '../../decorators/index.js';

const addContactValidation = validateBody(contactSchema.contactAddSchema);

export default {
  addContactValidation,
};

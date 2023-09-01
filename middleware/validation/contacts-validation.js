import { contactSchema } from '../../schemas/index.js';
import { validateBody } from '../../decorators/index.js';

const addContactValidation = validateBody(contactSchema.contactAddSchema);
const updateContactValidation = validateBody(contactSchema.contactUpdateSchema)

export default {
  addContactValidation,
  updateContactValidation
};

import express from 'express';
import { contactsController } from '../../controllers/index.js';
import * as contactSchema from '../../models/Contact.js';
import { validateBody } from '../../decorators/index.js';
import { isValidId, authenticate, checkContactOwnership } from '../../middlewares/index.js';

const contactAddValidation = validateBody(contactSchema.contactAddSchema);
const contactsUpdateValidation = validateBody(
  contactSchema.contactUpdateSchema
);
const contactsUpdateStatusValidation = validateBody(
  contactSchema.contactUpdateStatusSchema
);

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, checkContactOwnership, contactsController.getById);

router.post('/', contactAddValidation, contactsController.add);

router.delete('/:contactId', isValidId, checkContactOwnership, contactsController.deleteContact);

router.put(
  '/:contactId',
  contactsUpdateValidation,
  isValidId,
  checkContactOwnership,
  contactsController.update
);

router.patch(
  '/:contactId/favorite',
  contactsUpdateStatusValidation,
  isValidId,
  checkContactOwnership,
  contactsController.update
);

export default router;

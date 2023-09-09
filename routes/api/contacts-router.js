import express from 'express';
import { contactsController } from '../../controllers/index.js';
import * as contactSchema from '../../models/Contact.js'
import {validateBody} from '../../decorators/index.js'
import {isValidId} from '../../middlewares/index.js'

const contactAddValidation = validateBody(contactSchema.contactAddSchema);
const contactsUpdateValidation = validateBody(contactSchema.contactUpdateSchema)
const contactsUpdateStatusValidation = validateBody(contactSchema.contactUpdateStatusSchema)


const router = express.Router();

router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById);

router.post(
  '/',
  contactAddValidation,
  contactsController.add
);

router.delete('/:contactId',isValidId, contactsController.deleteContact);

router.put(
  '/:contactId',
  contactsUpdateValidation,
  isValidId,
  contactsController.update
);

router.patch('/:contactId/favorite', contactsUpdateStatusValidation, isValidId, contactsController.update)

export default router;
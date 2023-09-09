import express from 'express';
import { contactsController } from '../../controllers/index.js';
import * as contactSchema from '../../models/Contact.js'
import {validateBody} from '../../decorators/index.js'
import { isValidId } from '../../middlewares/index.js';

const contactAddValidation = validateBody(contactSchema.contactAddSchema)

const router = express.Router();

router.get('/', contactsController.getAll);

router.get('/:contactId',  contactsController.getById);

router.post(
  '/',
  contactAddValidation,
  contactsController.add
);

// router.delete('/:contactId', contactsController.deleteContact);

// router.put(
//   '/:contactId',
//   contactsValidation.updateContactValidation,
//   contactsController.update
// );

export default router;

import express from 'express';
import { contactsController } from '../../controllers/index.js';
import contactsValidation from '../../middleware/validation/contacts-validation.js';

const router = express.Router();

router.get('/', contactsController.getAll);

router.get('/:contactId', contactsController.getById);

router.post(
  '/',
  contactsValidation.addContactValidation,
  contactsController.add
);

router.delete('/:contactId', contactsController.deleteContact);

router.put(
  '/:contactId',
  contactsValidation.addContactValidation,
  contactsController.update
);

export default router;

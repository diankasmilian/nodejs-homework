import Contact from '../models/Contact.js';
import { HttpErrors } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getAll = async (req, res) => {
  const result = await Contact.find()
  res.json(result);
};

const getById = async (req, res) => {
  const contactId = req.params.contactId;
  console.log(req.params)
  const result = await Contact.findById(contactId)
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }
  res.json(result);
};

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await contactService.removeContact(contactId);
  if (!result) {
    throw HttpErrors(404, `Not found`);
  }
  res.json({
    message: 'Contact deleted',
  });
};

const update = async (req, res) => {
  const contactId = req.params.contactId;
  const existingContact = await contactService.getContactById(contactId);

  if (!existingContact) {
    throw HttpErrors(404, `Not found`);
  }
  if (req.body.name) {
    existingContact.name = req.body.name;
  }
  if (req.body.email) {
    existingContact.email = req.body.email;
  }
  if (req.body.phone) {
    existingContact.phone = req.body.phone;
  }
  const result = await contactService.updateContact(contactId, existingContact);

  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  // deleteContact: ctrlWrapper(deleteContact),
  // update: ctrlWrapper(update),
};

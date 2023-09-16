import Contact from '../models/Contact.js';
import { HttpErrors } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  let filter = { owner };

  if (favorite === 'true') {
    filter.favorite = true;
  }
  const result = await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .populate('owner', 'email');
  res.json(result);
};

const getById = async (req, res) => {
  const contactId = req.params.contactId;
  const { _id: owner } = req.user;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }
  // if (result.owner.toString() !== owner.toString()) {
  //   throw HttpErrors(404);
  // }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpErrors(404, `Not found`);
  }
  res.json({
    message: 'Contact deleted',
  });
};

const update = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpErrors(404, `Not found`);
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteContact: ctrlWrapper(deleteContact),
  update: ctrlWrapper(update),
};

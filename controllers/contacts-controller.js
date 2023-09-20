import Contact from '../models/Contact.js';
import { HttpErrors, cloudinary } from '../helpers/index.js';
import { ctrlWrapper } from '../decorators/index.js';
import fs from 'fs/promises'

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
  const result = await Contact.findOne({ _id: contactId, owner });
  if (!result) {
    throw HttpErrors(404, 'Not found');
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const {path: oldPath} = req.file;
  const {url: avatarURL} = await cloudinary.uploader.upload(oldPath, {
    folder: "contacts"
  })
  await fs.unlink(oldPath)
  const result = await Contact.create({ ...req.body, avatarURL, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const contactId = req.params.contactId;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!result) {
    throw HttpErrors(404, `Not found`);
  }
  res.json({
    message: 'Contact deleted',
  });
};

const update = async (req, res) => {
  const contactId = req.params.contactId;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body, {
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

import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';


export const getAllContacts = async ({ 
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id', 
  filter = {}
}) => {

  const limit = perPage;
  const skip = (page - 1) * perPage;
 

  const contactsQuery = ContactsCollection.find();

   if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }   
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
 const [contactsCount, contacts] = await Promise.all([

  ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);



  const paginationData = calculatePaginationData(contactsCount, perPage, page);

   
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
    try{
      const contact = await ContactsCollection.findById(contactId); 
      
        if (!contact) {
        throw createHttpError(404, 'Contact not found!');
        }
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
        throw createHttpError(400, 'Invalid contact ID format');
        }
    return contact;
    }
    catch(err) {
      console.log(err);
    };
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};



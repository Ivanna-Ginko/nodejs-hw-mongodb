import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';
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
   if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
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

export const getContactById = async (contactId, parentId) => {
    
    const contact = await ContactsCollection.findOne({ _id: contactId, userId: parentId  }); 

        if (!contact) 
        throw createHttpError(404, 'Contact not found!');

        //if (!contact.userId.equals(parentId)) 
        // throw createHttpError(404, 'This contact created not by you!');

    return contact;
};

    

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, parentId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId: parentId });
  return contact;
};

export const updateContact = async (contactId, parentId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId,
      userId: parentId
     },
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



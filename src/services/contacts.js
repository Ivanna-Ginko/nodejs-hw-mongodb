import { ContactsCollection } from '../db/models/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';


export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
    try{
      const contact = await ContactsCollection.findById(contactId); 
      //Далі для мене поки не зрозуміле явище: якщо айді не існує - приходить у відовідь не null.
      // Відповідь не може обробити жоден із if, що нижче. Без catch перемогти помилку 500 не вдається.
      //  Буду рада допомозі, не одну годину витратила на те, аби вирішити проблему
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

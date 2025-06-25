import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  console.log('==================================isValidId');
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
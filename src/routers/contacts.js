import { Router } from "express";
import { getContactByIdController, getContactsController, 
createContactController, deleteContactController,
upsertContactController, patchContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";



const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController), isValidId);

contactsRouter.post('/contacts', ctrlWrapper(createContactController), validateBody(createContactSchema),);

contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController), isValidId);

contactsRouter.put('/contacts/:contactId', ctrlWrapper(upsertContactController), isValidId);

contactsRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactController), validateBody(updateContactSchema), isValidId);

export default contactsRouter;
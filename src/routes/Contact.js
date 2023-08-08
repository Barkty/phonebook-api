import { Router } from "express";
import ContactController from '../controllers/Contact.js'
import { uploadFile, uploadImage } from "../services/storage.js";
import { createContactSchema, idSchema, multipleIdsSchema, uploadSchema, validator } from "../helpers/validator.js";

const router = Router();

const contactController = new ContactController()

router.post('/', validator.body(createContactSchema), uploadImage.single('avatar'), contactController.createContact)
router.patch('/:id', validator.params(idSchema), validator.body(createContactSchema), uploadImage.single('avatar'), contactController.updateContact)
router.get('/', contactController.getContacts)
router.delete('/delete/:id', validator.params(idSchema), contactController.deleteContact)
router.get('/:id', validator.params(idSchema), contactController.getContact)

// Bulk routes
router.post('/bulk', uploadFile.single('file'), contactController.createBulkContacts)
router.patch('/bulk/update', uploadFile.single('file'), contactController.updateBulkContacts)
router.post('/bulk/delete', uploadFile.single('file'), contactController.deleteBulkContacts)
router.post('/bulk/delete/id', validator.body(multipleIdsSchema), contactController.deleteBulkContactsById)

export default router;
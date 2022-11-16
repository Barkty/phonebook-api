import express from "express";
import imageUpload from "../middlewares/upload/imageUpload.js";
import ContactController from '../controllers/Contact.js'
import { uploadFile } from "../middlewares/upload/fileUpload.js";

const router = express.Router();

const contactController = new ContactController()

router.post('/', contactController.createContact)
router.patch('/:id', imageUpload.array('avatar'), contactController.updateContact)
router.get('/', contactController.getContacts)
router.delete('/delete/:id', contactController.deleteContact)
router.get('/:id', contactController.getContact)

// Bulk routes
router.post('/bulk', uploadFile.single('file'), contactController.createBulkContacts)
router.patch('/bulk/update', contactController.updateBulkContacts)
router.post('/bulk/delete', contactController.deleteBulkContacts)

export default router;
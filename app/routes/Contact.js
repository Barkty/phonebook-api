import express from "express";
import imageUpload from "../middlewares/upload/imageUpload.js";
import { createContact, deleteContact, getContacts, updateContact } from '../controllers/Contact.js'

const router = express.Router();

router.post('/', createContact)
router.patch('/:id', imageUpload.array('avatar'), updateContact)
router.get('/', getContacts)
router.delete('/delete/:id', deleteContact)


export default router;
import Contact from "../models/Contact.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequestError from '../utils/errors/badRequest.js'
import { createCustomError } from "../utils/customError.js";

export const createContact = asyncWrapper(async (req, res) => {

    try {
        
        const {
            body: { phone },
        } = req;
    
        //Check if email already exist
        const contact = await Contact.findOne({
            phone: phone,
        });
    
        if (contact) {

            res.status(400).json({
                message: "A contact with this phone number already exists.",
                success: 0,
            });
            // throw new BadRequestError("A contact with this phone number already exists");
        } else {

            const newContact = await Contact.create({
                ...req.body
            })
        
            res.status(200).json({
                message: "Contact added successfully.",
                data: newContact,
                success: 1,
            });
        }
    

    } catch (error) {

        throw error
    }

})

export const getContacts = asyncWrapper(async (req, res) => {

    try {
        const { contact } = req.query;
        let contacts = [];
        if (contact) {
            contacts = await Contact.find({ firstName: new RegExp(".*"+contact+".*", "i") });
        } else {
            contacts = await Contact.find({});
        }

        res.status(200).json({
            message: "All Contacts",
            data: contacts,
            success: 1,
        });

    } catch (error) {
        throw error
    }
})

export const updateContact = asyncWrapper(async (req, res) => {

    try {
        const contactId = req.params.id;

        const { path } = req?.files[0];

        const updateContact = {
            ...req.body,
            avatar: path
        }

        let contact = await Contact.findOne({
            _id: contactId,
        });

        if (!contact) {

            throw createCustomError(`Contact not found`, 404);
        }

        contact = await Contact.findOneAndUpdate(
            {
                _id: contactId,
            },
            updateContact,
            {
                new: true,
                runValidators: true,
            }
        )

        res.status(200).json({
            message: "Contact updated",
            data: contact,
            success: 1,
        });

    } catch (error) {

        throw error

    }
})

export const deleteContact = asyncWrapper(async (req, res) => {

    try {
        const contactId = req.params.id;
        const contact = await Contact.findOneAndDelete({
            _id: contactId,
        });

        if (!contact) {
            throw createCustomError(`No contact with id: ${contactId}`, 404);
        }
        res.status(200).json({
            message: "Contact Deleted",
            data: contact,
            success: 1,
        });
    } catch (error) {
        throw error
    }
})
import { Types } from "mongoose"
import Contact from "../models/Contact.js";
import asyncWrapper from "../middlewares/async.js";
import BadRequest from "../utils/errors/badRequest.js";
import { error, success } from "../helpers/response.js";
import { generateFilter } from "../utils/index.js";
import { paginate } from "../helpers/paginate.js";
import { createCustomError } from "../utils/errors/customError.js";
import { downloadExcelFileETL } from "../services/storage.js";

const { ObjectId } = Types
class ContactController {

    //Single writes
    /**
     * * createContact - Create a new contact
    */
    createContact = asyncWrapper(async (req, res) => {
    
        try {
            
            const {
                body: { phone }, file
            } = req;

            let query = { ...req.body }

            if (file?.path) {
                query = { ...query, avatar: file?.path }
            }
        
            //Check if contact already exist
            let contact = await Contact.findOne({ phone });
        
            if (contact) throw new BadRequest('Contact already exists')
                
            contact = await Contact({ ...query }).save()

            return success(res, 201, contact)
    
        } catch (e) {
    
            return error(res, 500, e)
        }
    
    })
    
    /**
     * * getContacts - Gets all contacts
    */
    getContacts = asyncWrapper(async (req, res) => {
    
        try {
            const { query: { page, limit } } = req;

            const filter = generateFilter(req.query)

            const options = { page, limit, filter, modelName: "Contact", sort: { createdAt: -1 }}

            const contacts = await paginate(options)

            return success(res, 200, contacts)
    
        } catch (e) {
            return error(res, 500, e)
        }
    })

    /**
     * * getContact - Gets a contacts
    */

    getContact = asyncWrapper(async (req, res) => {

        try {
            const { params: { id } } = req

            const contact = await Contact.findById({_id: id}).lean()

            if(!contact) throw createCustomError('Contact not found', 404)

            return success(res, 200, contact)
        } catch (e) {
            return error(res, 500, e)
        }
    })
    
    /**
     * * updateContact - Update a contact
    */
    updateContact = asyncWrapper(async (req, res) => {
    
        try {
            const { params: { id }, body, file } = req;
    
            let query = { ...body }

            if(file?.path) {
                query = { ...query, avatar: file.path }
            }
    
            let contact = await Contact.findById({_id: id }).lean();
    
            if(!contact) throw createCustomError('Contact not found', 404)

            contact = await Contact.findByIdAndUpdate({_id: id }, { $set: { ...query }},{ new: true } ).lean()
    
            return success(res, 200, contact)
        } catch (e) {
            return error(res, 500, e)
    
        }
    })
    
    /**
     * * deleteContact - Delete a contact
    */
    deleteContact = asyncWrapper(async (req, res) => {
    
        try {
            const { params: { id } } = req;

            const contact = await Contact.findByIdAndDelete({_id: id });
    
            if(!contact) throw createCustomError('Contact not found', 404)

            return success(res, 200, contact)
        } catch (e) {
            return error(res, 500, e)
        }
    })

    // Bulk writes
    /**
     * * createBulkContacts - Create bulk contacts via upload
     */
    createBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { file: { path } } = req

            const rows = await downloadExcelFileETL(path)

            const importError = []
            const importData = []

            await Promise.all(
                rows.map(async (row) => {
                    const contact = {
                        firstName: row["First name"],
                        lastName: row["Last name"],
                        phone: row["Phone"],
                        gender: row["Gender"]
                    };

                    let data = await Contact.create(contact).catch((e) => {
                        importError.push({ data: contact, e })
                    })

                    importData.push(data)
                })
            )
          
            return success(res, 201, { importData, importError })
        } catch (e) {
            return error(res, 500, e)
        }

    })

    /**
     * * updateBulkContacts - Update bulk contacts via upload
     */
    updateBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { file: { path } } = req

            const rows = await downloadExcelFileETL(path)

            const importError = []
            const importData = []

            await Promise.all(
                rows.map(async (row) => {
                    const contact = {
                        firstName: row["First name"],
                        lastName: row["Last name"],
                        phone: row["Phone"],
                        gender: row["Gender"]
                    };

                    let data = await Contact.updateOne({ phone: contact.phone }, { $set: { ...contact }}, { new: true }).catch((e) => {
                        importError.push({ data: contact, e })
                    })

                    importData.push(data)
                })
            )
          
            return success(res, 200, { importData, importError })
        } catch (e) {
            return error(res, 500, e)
        }
    })

    /**
     * * deleteBulkContactsById - Delete bulk contacts via _id
     */
    deleteBulkContactsById = asyncWrapper(async (req, res) => {

        try {
            const { body: { ids } } = req

            const data = ids.split('#')

            const contacts = await Contact.deleteMany({ _id: { $in: data }});

            return success(res, 200, contacts)
            
        } catch (e) {
            return error(res, 500, e)
        }
    })

    /**
     * * deleteBulkContacts - Create bulk contacts via upload
     */

    deleteBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { file: { path } } = req

            const rows = await downloadExcelFileETL(path)

            const importError = []
            const importData = []

            await Promise.all(
                rows.map(async (row) => {
                    const contact = {
                        firstName: row["First name"],
                        lastName: row["Last name"],
                        phone: row["Phone"],
                        gender: row["Gender"]
                    };

                    let data = await Contact.deleteOne({ phone: contact.phone }).catch((e) => {
                        importError.push({ data: contact, e })
                    })

                    importData.push(data)
                })
            )
          
            return success(res, 200, { importData, importError })
        } catch (e) {
            return error(res, 500, e)
        }
    })
}

export default ContactController;
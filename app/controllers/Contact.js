import Contact from "../models/Contact.js";
import asyncWrapper from "../middlewares/async.js";
import _ from 'underscore'


class ContactController {
    constructor(){}


    //Single writes

    /**
     * * createContact - Create a new contact
    */
    createContact = asyncWrapper(async (req, res) => {
    
        try {
            
            const {
                body: { phone },
            } = req;
        
            //Check if contact already exist
            const contact = await Contact.findOne({
                phone: phone,
            });
        
            if (contact) {
    
                res.status(400).json({
                    message: "A contact with this phone number already exists.",
                    success: 0,
                });
                
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
    
    /**
     * * getContacts - Gets all contacts
    */
    getContacts = asyncWrapper(async (req, res) => {
    
        try {
            const { contact } = req.query;
            let contacts = [];
            if (contact) {
                contacts = await Contact.find({ firstName: new RegExp(".*^"+contact+".*", "i") });
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
    
    /**
     * * updateContact - Update a contact
    */
    updateContact = asyncWrapper(async (req, res) => {
    
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
    
                res.status(404).json({
                    message: "Contact not found",
                    success: 0,
                });
    
            } else {
    
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
            }
    
    
        } catch (error) {
    
            throw error
    
        }
    })
    
    /**
     * * deleteContact - Delete a contact
    */
    deleteContact = asyncWrapper(async (req, res) => {
    
        try {
            const contactId = req.params.id;
            const contact = await Contact.findOneAndDelete({
                _id: contactId,
            });
    
            if (!contact) {
    
                res.status(404).json({
                    message: `No contact with id: ${contactId}`,
                    success: 0,
                });
    
            } else {
    
                res.status(200).json({
                    message: "Contact Deleted",
                    data: contact,
                    success: 1,
                });
            }
        } catch (error) {
            throw error
        }
    })

    // Bulk writes

    createBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { body } = req
            let contact = []
            let found = 0
            let freshContactsToAdd = ''
            
            for(let i = 0; i < body.length; i++) {

               //Check if contact already exist
                contact.push(await Contact.findOne({
                    phone: body[i].phone,
                }));
 
            }
            
            if(contact?.length > 0) {

                for(let i = 0; i < contact?.length; i++) {

                    found = _.findIndex(body, {...contact[i]?.phone})
                    console.log(found)
                    freshContactsToAdd = body.slice(found, i)
                }

                console.log('Fresh: ', freshContactsToAdd)
                const newContacts = await Contact.insertMany(freshContactsToAdd)
    
                res.status(200).json({
                    message: [
                        freshContactsToAdd.length > 0 && {success: "Contact added successfully."},
                        contact.length > 0 && {userError: `${contact.length} contacts already exist.`}
                    ],
                    data: newContacts,
                    success: 1,
                });
            }

        } catch (error) {

            throw error

        }
    })

    updateBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { body } = req
            let contact = []
            let updates;
            
            for(let i = 0; i < body.length; i++) {

                //Check if contact already exist
                contact.push(await Contact.findOne({
                    phone: body[i].phone,
                }));
  
            }

            for(let i = 0; i < contact.length; i++) {

                updates = await Contact.updateMany(
                    {phone: contact[i].phone},
                    {$set: {...body}}
                )
            }

            res.status(200).json({
                message: "Contacts updated",
                data: updates,
                success: 1,
            });

        } catch (error) {
            throw error
        }
    })

    deleteBulkContacts = asyncWrapper(async (req, res) => {

        try {
            const { body } = req
            let contact = []

            for(let i = 0; i < body.length; i++) {

                contact = await Contact.deleteMany(
                    {_id: body[i]._id}
                );
            }

            if(contact) {

                res.status(200).json({
                    message: "Contact Deleted",
                    data: contact,
                    success: 1,
                });
            }
            
        } catch (error) {
            throw error
        }
    })
}



export default ContactController;
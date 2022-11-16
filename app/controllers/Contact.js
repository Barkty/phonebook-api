import Contact from "../models/Contact.js";
import asyncWrapper from "../middlewares/async.js";
import _ from 'underscore'
import fs from 'fs'
import csv from 'fast-csv'
import readXlsxFile from "read-excel-file/node";


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
     * * getContact - Gets a contacts
    */

    getContact = asyncWrapper(async (req, res) => {

        try {
            const { id } = req.params

            const contact = await Contact.findOne({_id: id})

            if(!contact) {

                res.status(404).json({
                    message: 'Contact Not Found',
                    success: 0
                })

            } else {
                res.status(200).json({
                    message: 'Contact details',
                    data: contact,
                    success: 1
                })
            }
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
    
            // const { path } = req?.files[0];
    
            // const updateContact = {
            //     ...req.body,
            //     avatar: path
            // }
    
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
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                )
        
                res.status(200).json({
                    message: "Contact updated sucessfully",
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
                    message: "Contact Deleted Successfully",
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

            if (req.file == undefined) {

                res.status(400).json({
                    message: "Please upload an excel file!",
                    success: 0
                });

            } else {

                let contacts = []
                let path = __basedir + '/' + req.file.filename;

                readXlsxFile(path).then(async (rows) => {
                    // skip header
                    rows.shift();
              
                    rows.forEach((row) => {
                      let contact = {
                        firstName: row[1],
                        lastName: row[2],
                        phone: row[3],
                        gender: row[4],
                      };
              
                      contacts.push(contact);
                    });
              
                    const newContacts = await Contact.insertMany(contacts)
    
                    if(newContacts) {
    
                        res.status(200).json({
                            message: `File uploaded successfully: ${req.file.originalname}`,
                            data: newContacts,
                            success: 1,
                        })
                        
                    } else {
    
                        res.status(500).json({
                            message: `Failed to import data into database`,
                            success: 0,
                        })
    
                    }
                })
            }


          
        } catch (e) {
            throw e
        }

        // try {

        //     const { body } = req
        //     let contact = []
        //     let found = 0
        //     let freshContactsToAdd = ''
            
        //     for(let i = 0; i < body.length; i++) {

        //        //Check if contact already exist
        //         contact.push(await Contact.findOne({
        //             phone: body[i].phone,
        //         }));
 
        //     }
            
        //     if(contact?.length > 0) {

        //         for(let i = 0; i < contact?.length; i++) {

        //             found = _.findIndex(body, {...contact[i]?.phone})
        //             console.log(found)
        //             freshContactsToAdd = body.slice(found, i)
        //         }

        //         console.log('Fresh: ', freshContactsToAdd)
        //         const newContacts = await Contact.insertMany(freshContactsToAdd)
    
        //         res.status(200).json({
        //             message: [
        //                 freshContactsToAdd.length > 0 && {success: "Contact added successfully."},
        //                 contact.length > 0 && {userError: `${contact.length} contacts already exist.`}
        //             ],
        //             data: newContacts,
        //             success: 1,
        //         });
        //     }

        // } catch (error) {

        //     throw error

        // }
    })

    updateBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { body } = req
            console.log(body)
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
            const { ids } = req.body
            const data = ids.split('#')

            const contact = await Contact.deleteMany(
                {_id: {'$in': data }}
            );

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
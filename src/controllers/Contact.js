import Contact from "../models/Contact.js";
import asyncWrapper from "../middlewares/async.js";
import readXlsxFile from "read-excel-file/node";


class ContactController {

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
            const { query: { contact } } = req;

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
            const { params: { id } } = req

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
            const { params: { id } } = req;
    
            // const { path } = req?.files[0];
    
            // const updateContact = {
            //     ...req.body,
            //     avatar: path
            // }
    
            let contact = await Contact.findOne({
                _id: id,
            });
    
            if (!contact) {
    
                res.status(404).json({
                    message: "Contact not found",
                    success: 0,
                });
    
            } else {
    
                contact = await Contact.findOneAndUpdate(
                    {
                        _id: id,
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
            const { params: { id } } = req;

            const contact = await Contact.findOneAndDelete({
                _id: id,
            });
    
            if (!contact) {
    
                res.status(404).json({
                    message: `No contact with id: ${id}`,
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
    /**
     * * createBulkContacts - Create bulk contacts via upload
     */
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

                    //Search for duplicates

                    //Return counts of duplicates

                    //Save 
                    const newContacts = await Contact.insertMany(contacts, { ordered: true })
    
                    if(newContacts) {
    
                        res.status(200).json({
                            message: `Contacts uploaded successfully: ${req.file.originalname}`,
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

    })

    /**
     * * updateBulkContacts - Update bulk contacts via upload
     */
    updateBulkContacts = asyncWrapper(async (req, res) => {

        try {

            const { file: { filename, originalname } } = req

            if (req.file == undefined) {

                res.status(400).json({
                    message: "Please upload an excel file!",
                    success: 0
                });

            } else {

                let contacts = []
                let updatedContacts;
                let path = __basedir + '/' + filename;

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

                    for(let i = 0; i < contacts.length; i++) {

                        updatedContacts = await Contact.updateMany(
                            {phone: contacts[i].phone},
                            { $set: { firstName: contacts[i].firstName, lastName: contacts[i].lastName, phone: contacts[i].phone, gender: contacts[i].gender }},
                            {upsert: true}
                        )
                    }
    
                    if(updatedContacts) {
    
                        res.status(200).json({
                            message: `Contacts updated successfully: ${originalname}`,
                            data: updatedContacts,
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
    })

    /**
     * * deleteBulkContactsById - Delete bulk contacts via _id
     */
    deleteBulkContactsById = asyncWrapper(async (req, res) => {

        try {
            const { body: { ids } } = req

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

    /**
     * * deleteBulkContacts - Create bulk contacts via upload
     */

    deleteBulkContacts = asyncWrapper(async (req, res) => {

        try {
            
            const { file: { filename, originalname } } = req

            if (req.file == undefined) {

                res.status(400).json({
                    message: "Please upload an excel file!",
                    success: 0
                });

            } else {

                let contacts = []
                let updatedContacts;
                let path = __basedir + '/' + filename;

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

                    for(let i = 0; i < contacts.length; i++) {

                        updatedContacts = await Contact.deleteMany(
                            {phone: contacts[i].phone}
                        )
                    }
    
                    if(updatedContacts) {
    
                        res.status(200).json({
                            message: `Contacts deleted successfully: ${originalname}`,
                            data: updatedContacts,
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
    })
}



export default ContactController;
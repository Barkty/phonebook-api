import bcrypt from "bcrypt";

export const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword)

export const generateHashString = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync());

export const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min

/**
 *
 * @param {Object} obj
 * @param {Array<String>} properties
 * @returns {Object}
 */
export const removePropertiesFromObject = (obj, properties) => {
    let data = {}
    properties.forEach((key) => {
        delete obj[key];
    });

    data = { ...data, ...obj }
    
    return data
};

export const generateFilter = (query) => {
    const { userId } = query
    
    let filter = { userId }

    if (query.wildCardSearch) {
        const regex = new RegExp(`${query.wildCardSearch}`, 'i')
        filter = { 
            ...filter, 
            $or: [
                { firstName: { $regex: regex } },
                { phone: { $regex: regex } },
            ]
        }
    }

    return filter;
}
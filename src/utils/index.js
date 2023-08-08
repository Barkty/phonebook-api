import bcrypt from "bcrypt";

export const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword)

export const generateHashString = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync());

export const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min
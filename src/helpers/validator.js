import { createValidator } from "express-joi-validation";
import Joi from "joi";

export const validator = createValidator();

export const idSchema = Joi.object({
    id: Joi.string().required()
})

export const multipleIdsSchema = Joi.object({
    ids: Joi.string().required()
})

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

export const signUpSchema = Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    occupation: Joi.string().required(),
    avatar: Joi.any()
})

export const createContactSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().required(),
    avatar: Joi.any()
})

export const uploadSchema = Joi.object({
    file: Joi.any().required()
})
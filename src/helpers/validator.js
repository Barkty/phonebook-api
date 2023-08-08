import { createValidator } from "express-joi-validation";
import Mongoose from "mongoose";

const {
    Types: { ObjectId }
} = Mongoose;

export const validator = createValidator();
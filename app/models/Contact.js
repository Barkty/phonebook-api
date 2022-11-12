import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
        },
        avatar: String,
        phone: {
            type: String,
            required: true,
            minLength: 11,
            maxLength: 15,
        },
        gender: String,
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

export default mongoose.model("Contact", ContactSchema);
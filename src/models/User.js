import { model, Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { comparePassword } from "../utils/index.js";

const schema = new Schema(
    {
        fullName: { type: String },
        username: { 
            type: String,
            required: function() {
                return !this.fullName
            },
            trim: true,
            default: function() {
                return this.fullName.split(' ')[0]
            } 
        },
        password: { type: String, required: true, minLength: 8 },
        phone: { type: String, required: true, minLength: 11, maxLength: 15, unique: true },
        avatar: String,
        occupation: String,
        lastLogin: Date
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

schema.methods.isValidPassword = function isValidPassword(password) {
    return !this.password ? false : comparePassword(this.password, password);
};
schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);
export default model("User", schema);
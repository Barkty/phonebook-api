import { model, Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = new Schema(
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
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);
export default model("Contact", schema);
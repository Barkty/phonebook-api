import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const UserSchema = new mongoose.Schema(
    {
        username: { type: String },
        password: String,
        avatar: String
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);
export default mongoose.model("User", UserSchema);
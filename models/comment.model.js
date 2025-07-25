import { Schema } from "mongoose"
import mongoose from "mongoose"

const commentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        desc: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Comments", commentSchema)
import { Schema } from "mongoose"
import mongoose from "mongoose"

const daerahSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        total: {
            type:Number,
        },
        description: {
            type: String,
        },
        website: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Daerah", daerahSchema)
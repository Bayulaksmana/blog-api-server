import { Schema } from "mongoose"
import mongoose from "mongoose";

const kampusSchema = new Schema(
    {
        id_pt: {
            type: String,
            required: true,
            unique: true
        },
        kode: {
            type: Number,
            required: true
        },
        nama_singkat: {
            type: String
        },
        nama: {
            type: String,
            required: true
        },
        // sesuaikan field berdasarkan API yang kamu pakai
    },
    { timestamps: true });

export default mongoose.model("Kampus", kampusSchema);

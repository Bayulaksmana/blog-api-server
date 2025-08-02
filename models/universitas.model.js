import { Schema } from "mongoose"
import mongoose from "mongoose"

const universitasSchema = new Schema(
    {
        id_pt: {
            type: Schema.Types.ObjectId,
            ref: "kampus",
            unique: true
        },
        kelompok: {
            type: String
        },
        pembina: {
            type: String
        },
        id_sp: {
            type: String
        },
        kode_pt: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        no_tel: {
            type: String,
            required: true
        },
        no_fax: {
            type: String,
            required: true
        },
        website: {
            type: String,
            required: true
        },
        logo_url:{
            type: String
        },
        alamat: {
            type: String
        },
        nama_pt: {
            type: String,
            required: true
        },
        nm_singkat: {
            type: String,
            required: true
        },
        kode_pos: {
            type: String,
            required: true
        },
        provinsi_pt: {
            type: String,
            required: true
        },
        kab_kota_pt: {
            type: String,
            required: true
        },
        kecamatan_pt: {
            type: String
        },
        lintang_pt: {
            type: String
        },
        bujur_pt: {
            type: String
        },
        tgl_berdiri_pt: {
            type: String
        },
        tgl_sk_pendirian_sp: {
            type: String
        },
        sk_pendirian_sp: {
            type: String
        },
        status_pt: {
            type: String,
        },
        akreditasi_pt: {
            type: String
        },
        status_akreditasi: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Universitas", universitasSchema)
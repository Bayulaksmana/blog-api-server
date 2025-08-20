import express from "express"
import { getDataMahasiswa } from "../controllers/mahasiswa.controller"

const router = express.Router()

router.get("/", getDataMahasiswa)


export default router


import express from "express";
import { getUniversitas, getUniversitasId } from "../controllers/univ.controller.js";

const router = express.Router();

router.get("/", getUniversitas)
router.get("/detail", getUniversitasId)

export default router;

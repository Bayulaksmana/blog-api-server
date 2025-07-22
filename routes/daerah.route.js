import express from "express";
import { getDaerah, createDaerah } from "../controllers/daerah.controller.js";

const router = express.Router();

router.get("/", getDaerah)
router.post("/", createDaerah)

export default router;
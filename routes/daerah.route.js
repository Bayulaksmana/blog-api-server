import express from "express";
import { getDaerah, createDaerah, deleteDaerah } from "../controllers/daerah.controller.js";

const router = express.Router();

router.get("/", getDaerah)
router.post("/", createDaerah)
router.delete("/:id", deleteDaerah)

export default router;
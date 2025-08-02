import express from "express";
import { googleAuth } from "../controllers/google.controller.js";

const router = express.Router();

router.post("/", googleAuth)

export default router;
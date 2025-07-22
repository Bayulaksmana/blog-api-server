import express from "express";
import { postData } from "../controllers/data.controller.js";

const router = express.Router();

router.get("/bps", postData)

export default router;
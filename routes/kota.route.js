import express from "express";
import { getKotaApi } from "../controllers/api.controller.js";

const router = express.Router();

router.get("/", getKotaApi)

export default router;

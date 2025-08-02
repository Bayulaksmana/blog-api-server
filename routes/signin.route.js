import express from "express";
import { getAuthentication } from "../controllers/signin.controller.js";

const router = express.Router();

router.post("/", getAuthentication)

export default router;
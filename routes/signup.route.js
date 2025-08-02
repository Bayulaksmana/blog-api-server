import express from "express";
import { getAuthentication } from "../controllers/signup.controller.js";

const router = express.Router();

router.post("/", getAuthentication)

export default router;
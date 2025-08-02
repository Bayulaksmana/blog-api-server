import express from "express";
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost, updatePost, getPostById } from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";


const router = express.Router();

router.get("/upload-auth", uploadAuth)

router.get("/", getPosts)
router.get("/:slug", increaseVisit, getPost)
router.get("/id/:id", getPostById);
router.post("/", createPost)
router.patch("/feature", featurePost)
router.patch("/id/:id", updatePost);
router.delete("/:id", deletePost)

export default router;

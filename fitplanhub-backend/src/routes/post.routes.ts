// Post routes
import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, postController.createPost);
router.get("/feed", authenticate, postController.getFeedPosts);
router.get("/user/:userId", postController.getUserPosts);
router.post("/:id/like", authenticate, postController.likePost);
router.post("/:id/comment", authenticate, postController.commentOnPost);
router.delete("/:id", authenticate, postController.deletePost);

export default router;

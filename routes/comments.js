import { Router } from "express";
import verifyToken from "../middleware/verify-token.js";
import * as commentController from "../controllers/comments.js";

const router = Router();

router.post("/", verifyToken, commentController.createComment);
router.get("/", verifyToken, commentController.getSoundComments);
router.get("/:commentId", verifyToken, commentController.getComment);
router.delete("/:commentId", verifyToken, commentController.deleteComment);
router.put("/:commentId", verifyToken, commentController.updateComment);

export default router;

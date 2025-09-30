import { Router } from "express";
import verifyToken from "../middleware/verify-token.js ";
import * as soundController from "../controllers/comments.js";

const router = Router();

router.post("/", verifyToken, commentController.createComment);
router.get("/:commentId", commentController.getComment);
router.delete("/:commentId", verifyToken, commentController.deleteComment);





export default router;
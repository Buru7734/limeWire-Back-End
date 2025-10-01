import { Router } from "express";
import verifyToken from "../middleware/verify-token.js ";
import * as soundController from "../controllers/sounds.js";

const router = Router();

router.post("/", verifyToken, soundController.createSound);
router.get("/", verifyToken, soundController.getSounds);
router.get("/:soundId", verifyToken, soundController.getSound);
router.put("/:soundId", verifyToken, soundController.updateSound);
router.delete("/:soundId", verifyToken, soundController.deleteSound);

//router.put("/:soundId/like", verifyToken, soundController.likeSound);

export default router;

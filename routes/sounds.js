import { Router } from "express";
import verifyToken from "../middleware/verify-token.js";
import * as soundController from "../controllers/sounds.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  soundController.uploadMiddleware,
  soundController.createSound
);


router.get("/stream/:fileId", soundController.streamSoundFile);
router.get("/", soundController.getSounds);
router.get("/:soundId", soundController.getSound);
router.get("/:soundId/stream", soundController.streamSound);
router.put("/:soundId", verifyToken, soundController.updateSound);
router.delete("/:soundId", verifyToken, soundController.deleteSound);

//router.put("/:soundId/like", verifyToken, soundController.likeSound);

export default router;

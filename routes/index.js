import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import commentsRouter from "./comments.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);

export default router;

import { Router } from "express";
import verifyToken from "../middleware/verify-token.js";
import * as usersController from "../controllers/users.js";

const router = Router();

router.get("/", verifyToken, usersController.getUsers);

router.get("/:userId", verifyToken, usersController.getUser);

router.delete("/:userId", verifyToken, usersController.deleteUser);

export default router;

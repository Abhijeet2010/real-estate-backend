import express from "express";
import { login, logout, register } from "../controllers/auth.controllers.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);

export default router;

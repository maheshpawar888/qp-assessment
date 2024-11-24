import express from "express";
import { createOrderForUser, queryGrocery } from "../controllers/user.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/groceries", auth, queryGrocery);
router.post("/order", auth, createOrderForUser)

export default router;

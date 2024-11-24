import express from "express";
import { addGrocery, deleteGroceryItemById, updateGroceryItemById } from "../controllers/admin.controller";
import { auth } from "../middlewares/auth";
import { checkAdmin } from "../middlewares/admin.check";

const router = express.Router();

router.post("/groceries", auth, checkAdmin, addGrocery);
router.patch("/groceries/:id", auth, checkAdmin, updateGroceryItemById);
router.delete("/groceries/:id", auth, checkAdmin, deleteGroceryItemById);

export default router;

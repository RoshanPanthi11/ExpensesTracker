import express from "express";
import {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createExpense)
  .get(protect, getExpenses);

router.route("/:id")
  .delete(protect, deleteExpense)
  .put(protect, updateExpense);

export default router;
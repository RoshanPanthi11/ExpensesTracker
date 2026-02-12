import express from "express";
import {
  createIncome,
  getIncomes,
  deleteIncome
} from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createIncome)
  .get(protect, getIncomes);

router.route("/:id")
  .delete(protect, deleteIncome);

export default router;

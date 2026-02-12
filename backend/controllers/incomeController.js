import Income from "../models/Income.js";

// 🔹 Get All Incomes
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Create Income
export const createIncome = async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    const income = new Income({
      user: req.user._id,
      source,
      amount,
      date,
    });

    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Income
export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    income.source = req.body.source || income.source;
    income.amount = req.body.amount || income.amount;
    income.date = req.body.date || income.date;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    await income.deleteOne();
    res.json({ message: "Income removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

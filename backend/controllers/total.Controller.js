
import DailySpending from "../models/user.model.js"; // model mongoose

// GET total spending per week (Week 1–4 per bulan)
export default {
  async total(req, res) {
    try {
      // 1️⃣ cek semua data di DB
      const allData = await DailySpending.find({});
      console.log("All data in DB:", allData);

      // 2️⃣ aggregate per month, Week 1–4
      const summary = await DailySpending.aggregate([
        {
          $project: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            weekOfMonth: {
              $switch: {
                branches: [
                  { case: { $lte: [ { $dayOfMonth: "$date" }, 7 ] }, then: 1 },
                  { case: { $lte: [ { $dayOfMonth: "$date" }, 14 ] }, then: 2 },
                  { case: { $lte: [ { $dayOfMonth: "$date" }, 21 ] }, then: 3 },
                ],
                default: 4
              }
            },
            totalSpending: 1
          }
        },
        {
          $group: {
            _id: { year: "$year", month: "$month", week: "$weekOfMonth" },
            totalSpending: { $sum: "$totalSpending" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            week: "$_id.week",
            totalSpending: 1
          }
        }
      ]);

      console.log("Weekly summary (Week 1–4 per month):", summary);

      // 3️⃣ optional: total bulanan
      const monthly = await DailySpending.aggregate([
        {
          $project: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            totalSpending: 1
          }
        },
        {
          $group: {
            _id: { year: "$year", month: "$month" },
            monthlyTotal: { $sum: "$totalSpending" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            monthlyTotal: 1
          }
        }
      ]);

      console.log("Monthly total:", monthly);

      res.json({ weekly: summary, monthly });
    } catch (error) {
      console.error("Error in total:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

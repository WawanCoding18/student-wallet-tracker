// file: src/controllers/Data.js

import DailySpending from "../models/user.model.js"; // Pastikan path dan nama model ini benar

// Controller object
export default {
    async data(req, res) {
        const body = req.body;

        // Validasi body yang kosong
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({
                message: "Request body is missing",
                error: "Please send valid data",
                data: null,
            });
        }

        try {
            // Buat instance model baru dengan data dari req.body
            const newData = new DailySpending({
                currentBalance: body.currentBalance,
                topUpBalance: body.topUpBalance,
                totalSpending: body.totalSpending,
                date: body.date,
                spendingItems: body.spendingItems,
            });

            // Simpan dokumen ke database
            const result = await newData.save();
            


            // Respons sukses
            return res.status(201).json({
                message: "Data saved successfully",
                data: result,
            });

        } catch (error) {
            return res.status(400).json({
                message: "Validation error",
                error: error.message,
                data: null,
            });
        }
    },
};


// dummy(req: Request, res: Response) {
//   res.status(200).json({
//     message: "Success hit endpoint /dummy",
//     data: "OK",
//   });
// }

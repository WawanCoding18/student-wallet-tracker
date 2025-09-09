import DailySpending from "../models/user.model.js";

// Controller object
export default {
    async result(req, res) {
     

        try {
            // Buat instance model baru dengan data dari req.body
            const allData = await DailySpending.find();
         
            
            // Respons sukses
            return res.status(201).json({
                message: "Data saved successfully",
                data: allData,
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

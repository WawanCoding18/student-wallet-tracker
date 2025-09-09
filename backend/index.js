import express from "express";
import router from "./routes/api.js";
import connectDB from "./utils/database.js"; // Mengganti nama alias menjadi connectDB
import cors from "cors";

// Fungsi async untuk memulai server
const startServer = async () => {
  try {
    // Hubungkan ke database. Ini akan me-resolve jika berhasil.
    // Jika gagal, akan masuk ke blok catch.
    await connectDB();
    
    // Buat aplikasi Express
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Gunakan routes API
    app.use("/api", router);

    // Endpoint root untuk menunjukkan server berjalan
    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running!",
      });
    });

    // Middleware 404: Tangani semua permintaan ke endpoint yang tidak ditemukan
    app.use((req, res) => {
      res.status(404).json({
        message: "Endpoint not found",
        data: null,
      });
    });
    
    // Tentukan PORT dan jalankan server
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);

  }
};

// Panggil fungsi untuk memulai server
startServer();
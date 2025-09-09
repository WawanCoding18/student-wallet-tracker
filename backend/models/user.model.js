import mongoose from "mongoose";


// Skema untuk setiap item pengeluaran
const itemSchema = new mongoose.Schema({
  no: Number, // Nomor urut item
  name: String, // Nama item (misalnya: "Nasi Rames")
  source: String, // Sumber item (misalnya: "uang dari ortu")
  qty: Number, // Jumlah item (misalnya: 1)
  price: Number, // Harga per item (misalnya: 18000)
  subtotal: Number, // Subtotal (qty * price)

});

// Skema utama untuk data pengeluaran harian
const dailySpendingSchema = new mongoose.Schema({
  currentBalance: {
    type: Number,
    required: true,
    default: 0, // Saldo awal bisa diatur 0
  },
  topUpBalance: {
    type: Number,
    default: 0, // Saldo yang ditambahkan (top-up)
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Tanggal pengeluaran
  },
  spendingItems: [itemSchema], // Array untuk menyimpan item-item pengeluaran

  totalSpending: {
    // Penambahan field untuk total pengeluaran
    type: Number,
    default: 0,
  },

  remainBalance:{
    type: Number
  }
});

// ✅ Auto hitung remainBalance sebelum disimpan
dailySpendingSchema.pre("save", function (next) {
  this.remainBalance = this.currentBalance - this.totalSpending;
  next();
});

// Model MongoDB
const DailySpending = mongoose.model("DailySpending", dailySpendingSchema, "List_SpendMoney");

export default DailySpending;

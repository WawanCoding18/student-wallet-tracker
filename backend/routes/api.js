import express from "express";
import dataController from "../controllers/data.Controller.js";
import resultController from "../controllers/result.Controller.js";
import totalController from "../controllers/total.Controller.js";


const router = express.Router();

//api buat nyambungin ke api data dari mengirim data ke db sampai menerima data dari db
router.post("/data", dataController.data);
router.get("/data", resultController.result);
router.get("/data/total", totalController.total);


export default router;
import express from "express";
import { getAllNews } from "../controller/newsController.js";

const router = express.Router();

router.get("/", getAllNews);

export default router;
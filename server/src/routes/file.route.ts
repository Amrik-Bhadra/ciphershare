import { Router } from "express";
import upload from "../middlewares/upload.middleware";
import fileController from "../controllers/file.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/upload", protect, upload.single("file"), fileController.upload);
router.get("/download/:id", protect, fileController.download);

export default router;
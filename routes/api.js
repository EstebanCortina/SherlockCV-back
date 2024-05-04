import express from 'express';
const router = express.Router();
import multer from 'multer';
const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  res.status(200).send("api");
});

import upload_controller from "../controllers/upload_controllers.js";
router.post("/upload", upload.array("pdf"), upload_controller);

export default router

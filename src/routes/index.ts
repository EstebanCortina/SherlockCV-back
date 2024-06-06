import express from 'express'
import processFiles from "../middlewares/processFiles.js";
import validateFiles from "../middlewares/validateFiles.js";
const router = express.Router()

const upload = multer();

router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

import signUpController from '../controllers/signUpController.js'
router.post("/signup", signUpController);

import upload_controller from "../controllers/upload_controllers.js";
import filesGeminiAnalysis from "../middlewares/filesGeminiAnalysis.js";
import multer from "multer";
router.post("/upload",
    upload.array('file'),
    validateFiles,
    processFiles,
    filesGeminiAnalysis,
    upload_controller);


export default router

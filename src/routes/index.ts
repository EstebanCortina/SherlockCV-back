import express from 'express'
import processFiles from "../middlewares/processFiles.js";
import validateFiles from "../middlewares/validateFiles.js";
import protectRouteSJWT from "../middlewares/protectRouteSJWT.js";
const router = express.Router()

const upload = multer();

router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

import signUpController from '../controllers/signUpController.js'
import bodyValidator from "../middlewares/bodyValidator.js";
router.post("/signup", bodyValidator, signUpController);

import loginController from "../controllers/loginController.js"
router.post("/login", bodyValidator, loginController);

import upload_controller from "../controllers/upload_controllers.js";
import filesGeminiAnalysis from "../middlewares/filesGeminiAnalysis.js";
import multer from "multer";
router.post("/upload",
    upload.array('file'),
    validateFiles,
    processFiles,
    filesGeminiAnalysis,
    upload_controller);

router.get('/protected', protectRouteSJWT({"Admin": true}), (req, res) => {
  res.status(200).send("Protected");
})

export default router

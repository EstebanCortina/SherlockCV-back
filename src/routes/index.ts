import express from 'express'
import type { Request, Response } from 'express'
import processFiles from "../middlewares/processFiles.js";
import protectRouteSJWT from "../middlewares/protectRouteSJWT.js";
const router = express.Router()

const upload = multer();

router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

import signUpController from '../controllers/signUpController.js'
import bodyValidator from "../middlewares/bodyValidator.js";
router.post("/signup", bodyValidator(), signUpController);

import loginController from "../controllers/loginController.js"
router.post("/login", bodyValidator(), loginController);

import jobPositionsRouter from "./jobPositionsRouter.js";
router.use('/job-positions',
    protectRouteSJWT({
      "Admin": true,
      "Recruiter": true
    }), jobPositionsRouter)

import CAPcontroller from "../controllers/CAPcontroller.js";
import generateGeminiAnalysis from "../middlewares/generateGeminiAnalysis.js";
import multer from "multer";
router.post("/start-analysis",
    upload.array('candidates_files'), // This middleware only works at first place
    //protectRouteSJWT({"Admin": true}),
    bodyValidator(),
    processFiles,
    generateGeminiAnalysis,
    CAPcontroller);

router.get('/protected', protectRouteSJWT({"Admin": true}), (req, res) => {
  res.status(200).send("Protected");
})

router.get('/example/:id', bodyValidator(), (req: Request, res: Response) => {
    res.status(200).send("Protected");
})

export default router

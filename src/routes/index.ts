import express from 'express'
import type { Request, Response } from 'express'
import processFiles from "../middlewares/processFiles.js";
import protectRouteSJWT from "../middlewares/protectRouteSJWT.js";
const router = express.Router()

// This instance manages the req.files property
const upload = multer();

// Health endpoint for Render.com
router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

// Register a new user (default as Recruiter user-type)
import signUpController from '../controllers/signUpController.js'
import bodyValidator from "../middlewares/bodyValidator.js";
router.post("/signup", bodyValidator(), signUpController);

// Sign-in and get a SJWT for the web authorization
import loginController from "../controllers/loginController.js"
router.post("/login", bodyValidator(), loginController);

// CRUD Job-Positions entry point
import jobPositionsRouter from "./jobPositionRouter.js";
router.use('/job-positions',
    protectRouteSJWT({
      "Admin": true,
      "Recruiter": true
    }), jobPositionsRouter)

// Receives a CAP object and generates an analysis report
import reportController from "../controllers/reportController.js";
import generateGeminiAnalysis from "../middlewares/generateGeminiAnalysis.js";
import multer from "multer";
router.post("/start-analysis",
    upload.array('candidates_files'), // This middleware only works at first place
    protectRouteSJWT({"Admin": true, "Recruiter": true}),
    bodyValidator(),
    processFiles,
    generateGeminiAnalysis,
    reportController.createAsync);

// CRUD Reports entry point
import reportRouter from "./reportRouter.js";
router.use("/reports",
    protectRouteSJWT({
        "Admin": true,
        "Recruiter": true
    }), reportRouter)

// Endpoints for the authorization test
router.get('/protected', protectRouteSJWT({"Admin": true}), (req, res) => {
  res.status(200).send("Protected");
})

router.get('/example/:id', bodyValidator(), (req: Request, res: Response) => {
    res.status(200).send("Protected");
})

export default router

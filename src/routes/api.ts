import express, {Request, Response, Router} from 'express';
import multer from "multer"

const router: Router = express.Router();
const upload: multer.Multer = multer({ dest: "uploads/" });

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send("api");
});

import upload_controller from "../controllers/upload_controllers.js";
router.post("/upload", upload.array("file"), upload_controller);

export default router

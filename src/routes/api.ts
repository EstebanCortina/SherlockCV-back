import express, {Request, Response, Router} from 'express';
import fileUpload from "express-fileupload";
import multer from "multer"

const router: Router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Middleware de multer
const upload = multer({ storage: storage });

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send("api");
});

import upload_controller from "../controllers/upload_controllers.js";
router.post("/upload", upload.array('file'), upload_controller);

export default router

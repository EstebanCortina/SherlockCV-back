import express, {Request, Response, Router} from 'express';
import multer from "multer"

const router: Router = express.Router();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// Middleware de multer
const upload = multer();

router.get("/", (req: Request, res: Response): void => {
  res.status(200).send("api");
});

export default router

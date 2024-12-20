import express from 'express'
import reportController from "../controllers/reportController.js";

const router = express.Router()

router.get('/', reportController.indexAsync)

router.get('/:id', reportController.showAsync)

router.put('/:id', reportController.updateAsync)

export default router;
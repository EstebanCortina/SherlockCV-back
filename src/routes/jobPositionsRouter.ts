import express from 'express'
const router = express.Router()

import {
    indexAsync,
    showAsync,
    createAsync,
    updateAsync,
    toggleIsOpenAsync,
    deleteSoftAsync
} from "../controllers/jobPositionsController.js";
import bodyValidator from "../middlewares/bodyValidator.js";

const path = 'job-positions'

router.get('/', indexAsync);
router.post('/', bodyValidator(path), createAsync);

router.get('/:id', showAsync);
router.put('/:id', bodyValidator(path), updateAsync);
router.patch('/toggle-status/:id', toggleIsOpenAsync);
router.delete('/:id', deleteSoftAsync);


export default router
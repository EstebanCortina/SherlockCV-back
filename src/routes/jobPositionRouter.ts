import {body, validationResult} from "express-validator";
import express, {Request, Response, NextFunction} from 'express'

import JobPositionController from "../controllers/jobPositionController.js";
import bodyValidator from "../middlewares/bodyValidator.js";
import badRequest from "../messages/error/badRequest.js";

const router = express.Router()
const path = 'job-positions'

router.get('/', JobPositionController.indexAsync);

router.post('/',
    bodyValidator(path),
    getBodySanitization(),
    catchSanitizationErrors, JobPositionController.createAsync);

router.get('/:id', JobPositionController.showAsync);

router.put('/:id',
    bodyValidator(path),
    bodyValidator(path),
    getBodySanitization(),
    catchSanitizationErrors, JobPositionController.updateAsync);

router.patch('/toggle-status/:id', JobPositionController.toggleIsOpenAsync);

router.delete('/:id', JobPositionController.deleteSoftAsync);

function getBodySanitization(): Array<any>{
    return [
        body('**').trim().blacklist('<>&\'"/').escape(),
        body('name').optional().isLength({min: 2, max: 40}).withMessage("Job Position name too long or too short"),
        body('description').optional().isLength({min: 1}).withMessage("Job Position description too long or too short"),
        body('key_points').optional().isArray().withMessage("Bad request")
    ]
}

function catchSanitizationErrors(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(badRequest(400, errors.array()[0].msg));
    }
    next()
}

export default router
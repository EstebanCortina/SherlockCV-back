import {body, validationResult} from "express-validator";
import express, {Request, Response, NextFunction} from 'express'
const router = express.Router()

import JobPositionsController from "../controllers/jobPositionsController.js";
import bodyValidator from "../middlewares/bodyValidator.js";
import badRequest from "../messages/error/badRequest.js";
import {EntityBody} from "../types/EntityBody.js";

const path = 'job-positions'

const jobPositionsController = new JobPositionsController()

router.get('/', jobPositionsController.indexAsync);

router.post('/',
    bodyValidator(path),
    getBodySanitization(),
    catchSanitizationErrors, jobPositionsController.createAsync);

router.get('/:id', jobPositionsController.showAsync);

router.put('/:id',
    bodyValidator(path),
    bodyValidator(path),
    getBodySanitization(),
    catchSanitizationErrors, jobPositionsController.updateAsync);

router.patch('/toggle-status/:id', jobPositionsController.toggleIsOpenAsync);

router.delete('/:id', jobPositionsController.deleteSoftAsync);

function getBodySanitization(): Array<any>{
    return [
        body('**').trim().blacklist('<>&\'"/').escape(),
        body('name').optional().isLength({min: 2, max: 40}).withMessage("Job Position name too long or too short"),
        body('description').optional().isLength({min: 1, max: 200}).withMessage("Job Position description too long or too short"),
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
import {Request, Response, NextFunction} from "express";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";

export default async (req: Request, res: Response, next: NextFunction) => {
    const validatorFilename = getBodyValidatorByRoutePath(req.route.path)
    const module = await import((`../types/validators/${validatorFilename}`))

    for (let [key, value] of Object.entries(req.body)) {
        if (!module.default.hasOwnProperty(key) || typeof value !== module.default[key]) {
            return res.status(400).send({error: "bad key"})
        }
    }
    next()
}
import {Request, Response, NextFunction} from "express";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";
import badRequest from "../messages/error/badRequest.js";


export default async (req: Request, res: Response, next: NextFunction) => {
    const validatorFilename = getBodyValidatorByRoutePath(req.route.path)
    const module = await import((`../types/validators/${validatorFilename}`))
    const requiredFields = Object.keys(module.default.required).reverse()
    const allFields = {...module.default.required, ...module.default.optional}

    for (let [key, value] of Object.entries(req.body)) {
        if (module.default.required.hasOwnProperty(key)){
            requiredFields.pop()
        }

        if (typeof value !== allFields[key]) {
            console.log("Bad body request")
            console.log(req.body)
            return res.status(400).send(badRequest())
        }

        if (typeof value === "string"){
            if (!allFields[key].length) {
                console.log("Bad body request")
                console.log(req.body)
                return res.status(400).send(badRequest())
            }
        }

    }
    if (requiredFields.length) {
        console.log("Missing required fields in body");
        console.log(requiredFields)
        return res.status(400).send(badRequest())
    }
    next()
}
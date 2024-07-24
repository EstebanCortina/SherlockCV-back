import {Request, Response, NextFunction} from "express";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";
import badRequest from "../messages/error/badRequest.js";



export default (baseRoutePath: string = '') => async (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const validatorFilename = getBodyValidatorByRoutePath(baseRoutePath !== '' ? baseRoutePath : req.path);
    const module = await import((`../types/validators/${validatorFilename}`))
    let requiredFields: {[key:string]: string} = {};

    if(req.method === 'POST' || req.method === undefined) {
        requiredFields = JSON.parse(JSON.stringify(module.default.required));
    }

    const allFields = {...module.default.required, ...module.default.optional}
    for (let [key, value] of Object.entries(req.body)) {
        if (module.default.required.hasOwnProperty(key)){
            delete requiredFields[key]
        }

        if (typeof value !== allFields[key]) {
            console.log("Bad body request")
            console.log(req.body)
            req.bodyValidatorError = {
                "error": "Bad body request data types",
                "info": req.body
            };
            return res.status(400).send(badRequest())
        }

        if (typeof value === "string"){
            if (!allFields[key].length) {
                console.log("Bad body request")
                console.log(req.body)
                req.bodyValidatorError = {
                    "error": "Bad body request empty string",
                    "info": req.body
                };
                return res.status(400).send(badRequest())
            }
        }

        if (typeof value === 'object') {
            req.body[key] = JSON.stringify(req.body[key])
        }

    }
    if (Object.keys(requiredFields).length) {
        console.log("Missing required fields in body");
        console.log(requiredFields)
        req.bodyValidatorError = {
            "error": "Missing required fields in body",
            "info": requiredFields
        };
        return res.status(400).send(badRequest())
    }
    next()
}
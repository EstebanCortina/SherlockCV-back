import {Request, Response, NextFunction} from "express";
import getBodyValidatorByRoutePath from "../helpers/getBodyValidatorByRoutePath.js";
import badRequest from "../messages/error/badRequest.js";


/**
 * Validates if the `req.body` or `req.body.data` has a specific content
 *
 * It is necessary to have a validator in ../types/validators with the expected structure.
 * If the middleware is used at route level, the validator file name should follow
 * the path name.
 *
 * @param baseRoutePath string
 */
export default (baseRoutePath: string = '') => async (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const validatorFilename = getBodyValidatorByRoutePath(baseRoutePath !== '' ? baseRoutePath : req.path);
    const module = await import((`../types/validators/${validatorFilename}`))
    let requiredFields: {[key:string]: string} = {};

    req.body = req.body.data? JSON.parse(req.body.data) : req.body

    if((req.method === 'POST' || req.method === 'PUT') &&
        !Object.keys(req.body).length){
        return res.status(400).send(badRequest());
    }

    if(req.method === 'POST' || req.method === undefined) {
        requiredFields = JSON.parse(JSON.stringify(module.default.required));
    }

    const allFields = {...module.default.required, ...module.default.optional}
    for (let [key, value] of Object.entries(req.body)) {
        if (module.default.required.hasOwnProperty(key)){
            delete requiredFields[key]
        }

        if (typeof value !== allFields[key]) {
            console.log("Bad body request data types")
            console.log(key,typeof value, '!==', allFields[key])
            req.bodyValidatorError = {
                "error": "Bad body request data types",
                "info": req.body
            };
            return res.status(400).send(badRequest())
        }

        if (typeof value === "string"){
            if (!allFields[key].length) {
                console.log("Bad body request empty string")
                console.log(req.body)
                req.bodyValidatorError = {
                    "error": "Bad body request empty string",
                    "info": req.body
                };
                return res.status(400).send(badRequest())
            }
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
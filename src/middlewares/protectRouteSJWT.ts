import {Request, Response, NextFunction} from "express";
import type {WhiteList} from "../types/WhiteList.js";
import extractBearerToken from "../helpers/extractBearerToken.js";
import SJWT from "../config/SJWT.js";
import badRequest from "../messages/error/badRequest.js";
import {SessionJWT} from "../types/SessionJWT.js";

export default (allowedUserTypeNames: WhiteList) => async (
    req: Request,
    res: Response,
    next: NextFunction) =>
{

    if (!req.headers.authorization){
        return res.status(403).send(badRequest(
            403,"Authorization Missing")
        );
    }

    let payload: SessionJWT;
    try {

        payload = (
            await SJWT.decrypt(
                extractBearerToken(req.headers.authorization)
            )
        )

        // @ts-ignore
        req.userId = payload?.userId
        // @ts-ignore
        req.userTypeName = payload?.userTypeName;

    } catch (e: any) {

        if (e.code === "ERR_JWT_EXPIRED"){
            return res.status(403).send(badRequest(
                403,"Forbidden")
            );
        }
        console.error(e);

    }

    // @ts-ignore
    if (allowedUserTypeNames[payload.userTypeName] === undefined) {
        return res.status(403).send(badRequest(
            403,"Forbidden")
        );
    }

    next()
}
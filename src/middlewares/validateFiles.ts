import {Request, Response, NextFunction} from "express";

export default function validateFiles(req: Request, res: Response, next: NextFunction){
    console.log("validate Files")
    // @ts-ignore
    if (!req.files || req.files.length === 0) {
        console.log("No files found.");
        return res.status(400).send({ message: "No files uploaded" });
    }
    next()
}
import {Request, Response, NextFunction} from "express";
import mimeTypes from '../config/mimeTypes.js';
import {RawFile} from "../types/RawFile.js";

export default function validateFiles(req: Request, res: Response, next: NextFunction){
    // @ts-ignore
    if (!req.files || req.files.length === 0) {
        console.log("No files found.");
        return res.status(400).send({ message: "No files uploaded" });
    }
    // @ts-ignore
    for (let file: RawFile of req.files) {
        if (!mimeTypes.allowed.includes(file.mimetype)) {
            console.log("no mime type");
            return res.status(400).send({ message: `File type not allowed ${file.originalName}` });
        }
    }
    next()
}
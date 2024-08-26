import { Request, Response, NextFunction } from "express";
import type {MetaFile} from "../types/MetaFile.js";
import FileIdHandler from "../handlers/FileIdHandler.js";
import {cvAbstract} from "../types/cvAbstract.js";
import mimeTypes from "../config/mimeTypes.js";

/**
 * Middleware that handles the `req.files` for the CAP.
 *
 * In this asynchronous function every file is validated against the allowed Mimetypes
 * to accept only specific files configurations. Also, this middleware use FileId to retrieve
 * the plain text content of the uploaded documents. The final result is passed to
 * `req.candidatesInfo` property.
 *
 * @async
 * @param {Request} req - The HTTP request object, expected to contain a `userId` property.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param next - Next function to execute
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || req.files.length === 0) {
        console.log("No files found.");
        return res.status(400).send({ message: "No files uploaded" });
    }

    const fileContents: cvAbstract[] = [];
    // @ts-ignore
    for (let file of req.files) {
        // This validation clause cancels all the process if one of the files are not allowed
        if (!mimeTypes.allowed.includes(file.mimetype)) {
            return res.status(400).send({ message: `File type not allowed ${file.originalName}` });
        }
        try{
            fileContents.push(await FileIdHandler(file as MetaFile))
        }catch(err){
            // @ts-ignore
            return res.status(500).send({message: err?.message});
        }
    }
    req.candidatesInfo = fileContents
    next()
};

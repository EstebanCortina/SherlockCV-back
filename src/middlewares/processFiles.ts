import { Request, Response, NextFunction } from "express";
import extractFileText from "../handlers/extractFileText.js";
import {MetaFile} from "../types/MetaFile.js";


const processFiles = (req: Request, res: Response, next: NextFunction) => {
    const fileContents: MetaFile[] = [];
    let metaFile: MetaFile;

    // @ts-ignore
    for (let file of req.files) {
        // @ts-ignore
        extractFileText(file).then(response=>{
            metaFile = response;
            fileContents.push(metaFile);
        })
        .catch(err=>{
            console.error(err);
            // @ts-ignore
            return res.status(500).send({ message: err?.message });
        })
    }
    // @ts-ignore
    req.candidatesInfo = fileContents;
    next()
};

export default processFiles;

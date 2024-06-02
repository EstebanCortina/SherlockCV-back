import { Request, Response, NextFunction } from "express";
import extractFileText from "../handlers/extractFileText.js";
import {MetaFile} from "../types/MetaFile.js";


const processFiles = async (req: Request, res: Response, next: NextFunction) => {
    const fileContents: MetaFile[] = [];
// @ts-ignore
    for (let file of req.files) {
        try{
            const response = await extractFileText(file)
            fileContents.push(response);
        }catch(err){
            // @ts-ignore
            return res.status(500).send({message: err?.message});
        }
    }
    // @ts-ignore
    req.candidatesInfo = fileContents
    next()
};

export default processFiles;

import {RawFile} from "../types/RawFile.js";
import {MetaFile} from "../types/MetaFile.js";
import extractPDFText from '../helpers/extractPDF.js'
import extractDOCXText from '../helpers/extractDOCX.js'
import mimeType_proxy from "../config/mimeType_proxy.js";

export default async (file: any): Promise<MetaFile> => {
    const data: MetaFile = {
        fileName: null,
        content: null
    }
    //TODO make an object(proxy) to convert de mimetype into a function definition
    data.fileName = file.originalname
    console.log(file.mimetype)
    const handler = mimeType_proxy[file.mimetype]
    data.content = await handler(file.buffer)
    // if (file.mimeType === "application/pdf") {
    //     data.content = await extractPDFText(file.buffer);
    // } else if (file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    //     data.content = await extractDOCXText(file.buffer);
    // } else {
    //     throw new Error("Formato de archivo no compatible: " + file.originalName);
    // }
    return data;
}

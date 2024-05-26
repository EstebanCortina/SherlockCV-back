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
    data.fileName = file.originalname
    console.log(file.mimetype)
    const handler = mimeType_proxy[file.mimetype]
    data.content = await handler(file.buffer)
    return data;
}

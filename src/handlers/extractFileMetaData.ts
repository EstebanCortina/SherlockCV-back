import {MetaFile} from "../types/MetaFile.js";
import mimeType_proxy from "../config/mimeType_proxy.js";

export default async (file: any): Promise<MetaFile> => {
    let data: MetaFile = {} as MetaFile;
    data.fileName = file.originalname
    data.buffer = file.buffer
    const handler = mimeType_proxy[file.mimetype]
    // Rename this to helper (await helper(file.byffer)
    data.content = await handler(file.buffer)
    return data;
}

import * as crypto from "node:crypto";

export default (fileBuffer: any): Promise<string> => {
    return new Promise((resolve) => {
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        resolve(hashSum.digest('hex'));
    })
}
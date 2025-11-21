import { fromBuffer } from "pdf2pic";

/**
 * Convierte la primera página de un PDF (buffer)
 * a imagen PNG en base64.
 * @param {Buffer} pdfBuffer
 * @returns {Promise<string>} base64 string (sin prefijo data:image)
 */
export default async (fileBuffer: ArrayBuffer)=>{

    const pdfBuffer = Buffer.from(fileBuffer);
    
    console.log("pdfBuffer", pdfBuffer)
    const convert = fromBuffer(pdfBuffer, {
        density: 150,              
        format: "png",             
        width: 1024,               
        height: 1024,
        preserveAspectRatio: true,
    });
    
    const result = await convert(1, {
        responseType: "base64"
    });
    return result.base64;
}

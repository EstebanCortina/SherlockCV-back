import * as pdfjsLib from 'pdfjs-dist'
import {createCanvas} from "canvas";

export default async (fileBuffer: ArrayBuffer)=>{

    const pdf = await pdfjsLib.getDocument(new Uint8Array(fileBuffer)).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    //@ts-ignore
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const base64Image = canvas.toDataURL('image/png');

    return base64Image.split(',')[1];
}
import * as pdfjs from "pdfjs-dist";

export default async (pdfData: Buffer) => {
    try {
        const pdfDataArray = new Uint8Array(pdfData);
        const loadingTask = pdfjs.getDocument(pdfDataArray);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let pdfText = "";
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // @ts-ignore
            const pageText = textContent.items.map((item) => item.str).join(" ");
            pdfText += pageText + "\n";
        }
        return pdfText;
    } catch (error) {
        console.error("Error al extraer texto del PDF:", error);
        throw new Error("Internal server error");
    }
};

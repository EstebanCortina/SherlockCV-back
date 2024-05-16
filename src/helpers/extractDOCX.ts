import mammoth from "mammoth";

export default async (docxData: Buffer) => {
    try {
        const { value } = await mammoth.extractRawText({ buffer: docxData });
        return value;
    } catch (error) {
        console.error("Error al extraer texto del DOCX:", error);
        throw new Error("Internal server error");
    }
};
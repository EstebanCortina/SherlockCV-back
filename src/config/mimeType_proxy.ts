import extractPDF from '../helpers/extractPDF.js'
import extractDOCX from "../helpers/extractDOCX.js";

const handlerProxy: any = {
    "application/pdf": extractPDF,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": extractDOCX
}

export default handlerProxy;

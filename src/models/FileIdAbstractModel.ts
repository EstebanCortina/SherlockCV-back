import BaseModel from "../abstract_classes/BaseModel.js";

export default class FileIdAbstractModel extends BaseModel{
    file_id?: string;
    plain_text_content?: string;
    meta_data?: unknown
    constructor(){
        super("FileId_Abstract_view");
    }

}
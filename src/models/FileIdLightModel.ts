import BaseModel from "../abstract_classes/BaseModel.js";

export default class FileIdLightModel extends BaseModel{
    file_id?: string;
    data?: unknown;
    created_at?: string;
    deleted_at?: string;
    constructor(){
        super("FileId_Light");
    }

}
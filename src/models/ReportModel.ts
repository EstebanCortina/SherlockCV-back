import BaseModel from "../abstract_classes/BaseModel.js";

export default class ReportModel extends BaseModel{
    user_id?: string;
    final_analysis?: string;
    created_at?: string;
    deleted_at?: string;
    constructor(){
        super("report");
    }

}
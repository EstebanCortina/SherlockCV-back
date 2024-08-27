import BaseModel from "../abstract_classes/BaseModel.js";

export default class ReportModel extends BaseModel{
    final_analysis?: string;
    created_at?: string;
    deleted_at?: string;
    constructor(){
        super("report");
    }

}
import BaseModel from "../abstract_classes/BaseModel.js";

export default class UserModel extends BaseModel{
    name: string | undefined;
    last_name: string | undefined;
    constructor(tableName:string){
        super(tableName);
    }

}
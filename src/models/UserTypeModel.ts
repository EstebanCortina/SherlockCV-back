import BaseModel from "../abstract_classes/BaseModel.js";

export default class UserTypeModel extends BaseModel{
    name: string | undefined;
    is_active: string | undefined;
    constructor(){
        super("user_type");
    }

}
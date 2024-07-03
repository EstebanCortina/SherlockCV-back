import BaseModel from "../abstract_classes/BaseModel.js";

export default class UserModel extends BaseModel{
    name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    user_type_id : string | undefined;
    constructor(){
        super("user");
    }

}
import {EntityBody} from "../types/EntityBody.js";

export default class Controller {
    static safeBody: EntityBody;

    constructor(safeBody: EntityBody = {"safe": "body"}){
        Controller.safeBody = safeBody;
    }


}
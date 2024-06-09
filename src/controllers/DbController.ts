import Database from "../abstract_classes/Database.js";
import MysqlInterface from "../interfaces/MysqlInterface.js";

export default class DbController extends Database implements MysqlInterface{
    execQuery(query: string, params: (string | number)[]): Promise<any> {

    }
}
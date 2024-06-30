import MysqlInterface from "./MysqlInterface.js";

export default abstract class Database extends MysqlInterface {
    private static db: unknown;
    abstract execQuery(query: string, params: (string | number)[]): Promise<any>;
    setDbInstance(instance: unknown): void {
        if (!Database.db) Database.db = instance;
    }

}
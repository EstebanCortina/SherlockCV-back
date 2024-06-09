export default interface MysqlInterface {
    execQuery(query: string, params: (string | number)[]): Promise<any>;
}
import DbHandler from "../handlers/DbHandler.js";

export default abstract class BaseModel extends DbHandler {
    private __query: string | null = null
    private __where: string | null = null
    private __is_retrieve_data: boolean = false
    private readonly __tableName: string
    protected constructor(tableName: string) {
        super()
        this.__tableName = tableName
    }

    index(fields: Array<string> = ["*"]){
        this.__query = this.__create_select(fields)
        return this
    }

    create(values: Array<string | unknown>, retrieve_data: boolean = false) {
        this.__query = this.__create_insert(values)
        this.__is_retrieve_data = retrieve_data
        return this
    }

    update(values: Array<string>){
        this.__query = this.__create_update(values)
        return this
    }

    delete_soft(){
        this.update(["deleted_at = CURRENT_TIMESTAMP"])
        return this
    }

    delete(){
        this.__query = this.__create_delete()
        return this
    }

    where(clauses: Array<string> | string){
        if (!this.__where){
            this.__where = "WHERE "
        }
        this.__where += `${clauses},`
        return this
    }

    find(id: number | string) {
        this.index().where(`id = ${id}`)
        return this
    }



    async run(params: Array<string> = [], query_debug= false) {
        if (!this.__query) {
            this.__where = null
            throw new Error("No query provided")
        }
        const final_query: string = `${this.__query} ${this.__where?? ""}`.slice(0, -1)
        this.__query = null
        this.__where = null
        if (query_debug) {
            return final_query
        }
        const result = await this.execQuery(final_query, params)
        if (this.__is_retrieve_data){
            this.__is_retrieve_data = false
            return await this.__retrieve_data(result.lastId)
        }
        return result
    }

    private __create_select(fields: Array<string>){
        return `SELECT ${fields} FROM ${this.__tableName}`
    }

    private __create_insert(values: Array<string | unknown>){
        return (`
        INSERT INTO ${this.__tableName} 
        (${this.__get_instance_attributes()}) 
        VALUES (${values.map(value => value != "?" ? `'${value}'` : value)})
        `)
    }

    private __create_update(values: Array<string>){
        return `UPDATE ${this.__tableName} SET ${values}`
    }

    private __create_delete(){
        return `DELETE FROM ${this.__tableName}`
    }

    private __get_instance_attributes(){
        return Object.keys(this).filter(key => !key.startsWith('_'))
    }

    private async __retrieve_data(lastId: number) {
        let retrieve_query = `SELECT * FROM ${this.__tableName} `;
        if (lastId) {
            retrieve_query += ` WHERE ${lastId}`
        } else {
            const lastUuid = await this.execQuery("SELECT @last_uuid", [])
            retrieve_query += ` WHERE id = '${lastUuid[0]["@last_uuid"]}'`
        }
        return await this.execQuery(retrieve_query, [])
    }

    private __get_instance_attributes_values(){
        // @ts-ignore
        return this.__get_instance_attributes().map(key => this[key])
    }
}
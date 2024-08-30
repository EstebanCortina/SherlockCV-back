import DbHandler from "../handlers/DbHandler.js";
import {EntityBody} from "../types/EntityBody.js";

export default abstract class BaseModel extends DbHandler {
    private __query: string | null = null
    private __where: string | null = null
    private __is_retrieve_data: boolean = false
    private __is_order_values: boolean = false
    private readonly __tableName: string
    protected constructor(tableName: string) {
        super()
        this.__tableName = tableName
    }

    index(fields: Array<string> = ["*"]){
        this.__query = this.__create_select(fields)
        return this
    }

    create(
        values: Array<string> | EntityBody,
        retrieve_data: boolean = false,
    )
    {
        this.__query = this.__create_insert(values)
        this.__is_retrieve_data = retrieve_data
        return this
    }

    update(values: Array<string> | EntityBody,
           retrieve_data: boolean = false){
        this.__query = this.__create_update(values)
        this.__is_retrieve_data = retrieve_data;
        return this
    }

    delete_soft(){
        this.update(["deleted_at = CURRENT_TIMESTAMP"], true)
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



    async run(params: Array<any> = [], query_debug: boolean = false) {
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

        try{
            const result = await this.execQuery(final_query, params)
            if (this.__is_retrieve_data){
                console.log("retrieve")
                console.log(result)
                this.__is_retrieve_data = false
                return await this.__retrieve_data(result.insertId)
            }
            return result
        }catch (e) {
            console.log(e)
            throw new Error("Execution query error");
        }
    }

    private __create_select(fields: Array<string>){
        return `SELECT ${fields} FROM ${this.__tableName}`
    }

    private __create_insert(values: Array<string> | EntityBody){
        /*
        Para este punto hay dos opciones, o vienen los valores como:
        ['Esteban', 'Cortina', ...]
        o
        {
            'name': 'Esteban',
            'last_name': 'Cortina'
        }
        o
        {
            'name': '?',
            'last_name': '?'
        }
        Tanto ordenados como desordenados.
         */

        let tableFields;
        let oValues: string[];

        if (!Array.isArray(values)) {
            let dict = this.__order_query_values(values)
            oValues = Object.values(dict)
            tableFields = Object.keys(dict)
        } else {
            //Asumimos que vienen ordenados
            oValues = values
            tableFields = this.__get_instance_attributes()
        }

        return (`
        INSERT INTO ${this.__tableName} 
        (${tableFields})
        VALUES (${oValues.map(value => value != "?" ? `'${value}'` : value)})
        `)
    }

    private __create_update(values: Array<string> | EntityBody){
        let updateValues: string = '';
        if (!Array.isArray(values)) {
            for (let [key, value] of Object.entries(values)) {
                updateValues += `${key}='${value}',`
            }
        } else {
            for(let value of values) {
                updateValues += `${value},`
            }
        }
        updateValues = updateValues.slice(0, -1)
        return `UPDATE ${this.__tableName} SET ${updateValues}`
    }

    private __create_delete(){
        return `DELETE FROM ${this.__tableName}`
    }

    private __get_instance_attributes(): Array<string>{
        return Object.keys(this).filter(key => !key.startsWith('_'))
    }

    private async __retrieve_data(lastId: number) {
        let retrieve_query = `SELECT * FROM ${this.__tableName} `;
        if (lastId) {
            retrieve_query += `WHERE id = ${lastId}`
        } else {
            const lastUuid = await this.execQuery("SELECT @last_uuid", [])
            retrieve_query += `WHERE id = '${lastUuid[0]["@last_uuid"]}'`
        }
        return (await this.execQuery(retrieve_query, []))[0]?? {}
    }

    private __get_instance_attributes_values(){
        // @ts-ignore
        return this.__get_instance_attributes().map(key => this[key])
    }

    public __order_query_values(uoParams: Object): any {
        const queryOrder: string[] = Object.keys(uoParams)
        const oParams = {}

        for (let field of queryOrder) {
            // @ts-ignore
            oParams[field] = uoParams[field]
        }

        return oParams
    }
    private __setInParams(inParams: Array<string> | Object): Array<string> {
        if (typeof inParams === 'object') {
            if (this.__is_order_values) {
                return Object.values(this.__order_query_values(inParams))
            }
            return Object.values(inParams)
        } else if(Array.isArray(inParams) && inParams) {
            return inParams
        }
        return []
    }
}
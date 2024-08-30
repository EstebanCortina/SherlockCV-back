import {expect} from "chai";
import UserModel from "../models/UserModel.js"
import {EntityBody} from "../types/EntityBody.js";

describe('BaseModel', () => {
    const baseModel = new UserModel()
    it('should throw "no query provided"', async ()=> {
        try{
            await (
                baseModel
                    .where(["name = ?", "last_name = ?"])
                    .where("a = ?")
                    .run(["Esteban", "Cortina"], true)
            )
        // @ts-ignore
        }catch (e: Error){
            console.log(e.message)
            expect(e.message).to.be.equal("No query provided");
        }
    });

    it('should create a basic SELECT query', async ()=> {
        let query = await (
            baseModel.index()
                .run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal("SELECT * FROM user");
    });

    it('should create a basic SELECT query selecting fields', async ()=> {
        let query = await (
            baseModel.index(["name", "last_name"])
                .run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal("SELECT name,last_name FROM user");
    });

    it('should create a basic SELECT query with multiple where clauses', async ()=> {
        let query = await (
            baseModel.index()
                .where(["name = ?", "last_name = ?"])
                .where("a = ?")
                .run(["Esteban", "Cortina", "a"], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal("SELECT * FROM user WHERE name = ?,last_name = ?,a = ?");
    });

    it('should create a basic SELECT query with a single where clause by id', async ()=> {
        let id = 1
        let query = await (
            baseModel.find(id)
                .run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal(`SELECT * FROM user WHERE id = ${id}`);
    });

    it('should create a basic INSERT query', async ()=> {
        let query = await (
            baseModel.create(["Esteban", "Cortina"]).run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal(`
        INSERT INTO user 
        (name,last_name,email,password,user_type_id)
        VALUES ('Esteban','Cortina')
        `);
    });

    it('should create a basic INSERT query using params', async ()=> {
        let query = await (
            baseModel.create(["?", "?"]).run(["Esteban", "Cortina"], true)
        )

        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal(`
        INSERT INTO user 
        (name,last_name,email,password,user_type_id)
        VALUES (?,?)
        `);
    });

    it('should create a basic INSERT query using ordered EntityBody', async ()=> {
        let query = await (
            baseModel.create({
                "name": "Esteban",
                "last_name": "Cortina"
            }).run([], true)
        )

        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal(`
        INSERT INTO user 
        (name,last_name)
        VALUES ('Esteban','Cortina')
        `);
    });

    it('should create a basic INSERT query using unordered EntityBody', async ()=> {
        let query = await (
            baseModel.create({
                "last_name": "Cortina",
                "name": "Esteban"
            }).run([], true)
        )

        expect(typeof query).to.be.equal("string");
        expect(query).to.deep.equal(`
        INSERT INTO user 
        (last_name,name)
        VALUES ('Cortina','Esteban')
        `);
    });

    it('should create a basic UPDATE query using params', async ()=> {
        let query = await (
            baseModel.update(["name=?", "last_name=?"]).where(`id = 1`).run(["Esteban", "Cortina"], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.be.deep.equal("UPDATE user SET name=?,last_name=? WHERE id = 1")
    });

    it('should create an UPDATE query setting deleted_at to CURRENT_TIMESTAMP', async ()=> {
        let query = await (
            baseModel.delete_soft().where(`id = 1`).run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.be.deep.equal("UPDATE user SET deleted_at = CURRENT_TIMESTAMP WHERE id = 1")
    });

    it('should create a DELETE query', async ()=> {
        let query = await (
            baseModel.delete().where(`id = 1`).run([], true)
        )
        expect(typeof query).to.be.equal("string");
        expect(query).to.be.deep.equal("DELETE FROM user WHERE id = 1")
    });

    it('should order the input values according to the entity attributes in database', ()=> {
        let sample = {
                "name": "Esteban",
                "last_name": "Cortina",
                "email": "ecortina@gmail.com",
                "password": "123",
                "user_type_id": "098"
            }
        let oParams =  (
            baseModel.__order_query_values({
                "name": "Esteban",
                "last_name": "Cortina",
                "email": "ecortina@gmail.com",
                "password": "123",
                "user_type_id": "098"
            })
        )

        expect(oParams).to.be.deep.equal(sample)
        oParams =  (
            baseModel.__order_query_values({
                "last_name": "Cortina",
                "name": "Esteban",
                "password": "123",
                "user_type_id": "098",
                "email": "ecortina@gmail.com"
            })
        )
        console.log("segundo ordenamiento")

        expect(oParams).to.be.deep.equal(sample)
    });
});
import sinon from 'sinon'
import {expect} from "chai";
import BaseModel from "../abstract_classes/BaseModel.js"
import UserModel from "../models/UserModel.js"

describe('BaseModel', () => {
    const baseModel = new UserModel("user")
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
    });

    it('should create a basic SELECT query selecting fields', async ()=> {
        let query = await (
            baseModel.index(["name", "last_name"])
                .run([], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a basic SELECT query with multiple where clauses', async ()=> {
        let query = await (
            baseModel.index()
                .where(["name = ?", "last_name = ?"])
                .where("a = ?")
                .run(["Esteban", "Cortina", "a"], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a basic SELECT query with a single where clause by id', async ()=> {
        let query = await (
            baseModel.find(1)
                .run(["Esteban", "Cortina", "a"], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a basic INSERT query', async ()=> {
        let query = await (
            baseModel.create(["Esteban", "Cortina"]).run([], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a basic INSERT query using params', async ()=> {
        let query = await (
            baseModel.create(["?", "?"]).run(["Esteban", "Cortina"], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a basic UPDATE query using params', async ()=> {
        let query = await (
            baseModel.update(["name=?", "last_name=?"]).where(`id = 1`).run(["Esteban", "Cortina"], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create an UPDATE query setting deleted_at to CURRENT_TIMESTAMP', async ()=> {
        let query = await (
            baseModel.delete_soft().where(`id = 1`).run([], true)
        )
        expect(typeof query).to.be.equal("string");
    });

    it('should create a DELETE query', async ()=> {
        let query = await (
            baseModel.delete().where(`id = 1`).run([], true)
        )
        expect(typeof query).to.be.equal("string");
    });
});
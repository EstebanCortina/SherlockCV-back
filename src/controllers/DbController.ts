import fs from 'fs'
import dotenv from "dotenv";
import {PoolOptions, Pool, createPool} from "mysql2";
import Database from "../abstract_classes/Database.js";

export default class DbController extends Database {
    static poolConfig: null | PoolOptions = null;
    static pool: null | Pool = null;

    constructor() {
        console.log("Creating Pool...");
        super();
        this.__createPool(this.__getPoolConfig())
    }

    __getPoolConfig() {
        if (DbController.poolConfig){
            return DbController.poolConfig;
        }

        dotenv.config();
        if (!process.env.DB_URI) {
            throw new Error("DB_URI environment variable is missing");
        }
        const uri = new URL(process.env.DB_URI);

        const poolConfig: PoolOptions = {
            host: uri.hostname,
            port: parseInt(uri.port),
            user: uri.username,
            password: uri.password,
            database: uri.pathname.substring(1),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: true,
                ca: fs.readFileSync('./dist/config/sherlock-db-ca.pem'),
            }
        }
        DbController.poolConfig = poolConfig;
        return poolConfig;
    }

    __createPool(poolOptions: PoolOptions) {
        if (!DbController.pool) {
            DbController.pool = createPool(DbController.poolConfig ?? poolOptions);
        }
        return DbController.pool
    }
    execQuery(query: string, params: Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            DbController.pool.getConnection((err, connection) => {
                console.log("Getting Connection...")
                if (err) {
                    return reject({
                        httpStatus: 500,
                        message: "Error in pool connection",
                        data: err,
                    });
                }
                // @ts-ignore
                connection.query(query, params, (err, results, fields) => {
                    console.log("Executing Query...")
                    if (err) {
                        connection.release();
                        return reject({
                            httpStatus: 500,
                            message: "Error in query execution",
                            data: err,
                        });
                    }
                    connection.release();
                    resolve(results);
                });
            });
        });
    }
}
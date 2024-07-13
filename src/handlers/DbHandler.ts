import fs from 'fs'
import dotenv from "dotenv";
import {PoolOptions, Pool, createPool} from "mysql2";
import {InternalServerError} from "../types/InternalServerError.js";
import Database from "../abstract_classes/Database.js";

export default class DbHandler extends Database {
    static poolConfig: null | PoolOptions = null;
    static pool: null | Pool = null;

    constructor() {
        console.log("Creating Pool...");
        super();
        this.__createPool(this.__getPoolConfig())
    }

    __getPoolConfig() {
        if (DbHandler.poolConfig){
            return DbHandler.poolConfig;
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
                ca: fs.readFileSync(process.env.NODE_ENV === 'prod' ? '/etc/secrets/config.pem' : 'config.pem'),
            }
        }
        DbHandler.poolConfig = poolConfig;
        return poolConfig;
    }

    __createPool(poolOptions: PoolOptions) {
        if (!DbHandler.pool) {
            console.log("New Pool")
            DbHandler.pool = createPool(DbHandler.poolConfig ?? poolOptions);
        }
        console.log("Reusing Pool...");
        return DbHandler.pool
    }
    execQuery(query: string, params: Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            let serverError: InternalServerError = {httpStatus: 500, message: "", data: null};
            // @ts-ignore
            DbHandler.pool.getConnection((err, connection) => {
                console.log("Getting Connection...")
                if (err) {
                    serverError.httpStatus = 500;
                    serverError.message = "Error in pool connection";
                    serverError.data = err;
                    return reject(serverError);
                }
                // @ts-ignore
                connection.query(query, params, (err, results, fields) => {
                    console.log("Executing Query...")
                    console.log(query)
                    if (err) {
                        connection.release();
                        serverError.httpStatus = 500;
                        serverError.message = "Error in pool connection";
                        serverError.data = err;
                        return reject(serverError);
                    }
                    connection.release();
                    resolve(results);
                });
            });
        });
    }
}
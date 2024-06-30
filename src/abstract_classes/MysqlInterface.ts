import {Pool, PoolOptions} from "mysql2";

export default abstract class MysqlInterface {
    abstract __getPoolConfig(): PoolOptions
    abstract __createPool(poolOptions: PoolOptions): Pool
}
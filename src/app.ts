import dotenv from "dotenv";
dotenv.config();

import express, {Express} from "express";
import morgan from "morgan";
import cors from "cors";
import setDatabaseCA from "./config/setDatabaseCA.js"

const app:Express = express();

if (process.env.NODE_ENV === 'dev') setDatabaseCA()

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "prod" ? "combined" : "dev"));


import router from "./routes/index.js";
app.use("/", router);

app.listen(process.env.PORT, (): void => {
    console.log(`Running on ${process.env.PORT}`);
});

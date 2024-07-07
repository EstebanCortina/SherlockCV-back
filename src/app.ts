import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type {Express} from "express"
import morgan from "morgan";
import cors from "cors";
import setDatabaseCA from "./config/setDatabaseCA.js"

const app:Express = express();

if (process.env.NODE_ENV === 'dev') setDatabaseCA()

const allowedOrigins = [
    process.env.LOCAL_URL_FRONT,
    process.env.QA_URL_FRONT,
    process.env.PROD_URL_FRONT
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Origin not allowed: ", origin);
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "prod" ? "combined" : "dev"));


import router from "./routes/index.js";
app.use("/", router);

app.listen(process.env.PORT, (): void => {
    console.log(`Running on ${process.env.PORT}`);
});

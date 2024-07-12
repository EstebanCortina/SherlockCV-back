import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type {Express} from "express"
import morgan from "morgan";
import cors from "cors";
import setDatabaseCA from "./config/setDatabaseCA.js"
import SJWT from "./config/SJWT.js";

const app:Express = express();

if (process.env.NODE_ENV === 'dev') setDatabaseCA()

new SJWT(process.env.JWT_SECRET_WORD ?? "dev");

(async ()=> console.log(await SJWT.decrypt("eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..5BMu2gmHP2mAmDOl2w5Tmg.5rnMUnOQKrXvsFbwC5Hr6sbJXusUXOisFX2tqqBBGg0CSRPYDG2pptVsUlXLM8HF8QaeU-l0PfalxgfS7qukMFopu7McBibzCChLI0D2H5ogkt4JVcZQz2xjOmP2lka4lsBtlIKeS8gNBwS36WJSX9ZxB_nKhNu8THJkqGB_XAocqPZffZfXnQcwvOrm2qJTr4SqODzPvq0bc5JYZdV6UEkTk1DxAhfBUHH3fj-ztlMxx3SgRvTbzRf8G-DDKqAb.Kh7wmeD7QhsHYHNy2QFKaw")))()

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

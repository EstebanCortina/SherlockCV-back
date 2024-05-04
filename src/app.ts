import dotenv from "dotenv";
dotenv.config();

import express, {Express, urlencoded} from "express";
import morgan from "morgan";
import cors from "cors";

const app:Express = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(morgan("dev"));


import router from "./routes/index.js";
app.use("/", router);

app.listen(process.env.PORT, (): void => {
    console.log(`Running on ${process.env.PORT}`);
});

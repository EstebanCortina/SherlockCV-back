import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();

import router from "./routes/index.js";
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});

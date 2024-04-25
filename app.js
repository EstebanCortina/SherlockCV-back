require("dotenv").config();
const express = require("express");
const app = express();

const router = require("./routes");
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}`);
});

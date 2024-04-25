const router = require("express").Router();
const api_router = require("./api.js");

router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

router.use("/api", api_router);

module.exports = router;

const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  res.status(200).send("api");
});

const upload_controller = require("../controllers/upload_controllers.js");
router.post("/upload", upload.array("pdf"), upload_controller);

module.exports = router;

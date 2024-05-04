import express from 'express'
const router = express.Router()

import api_router from './api.js'

router.get("/", (req, res) => {
  res.status(200).send("SherlockCV");
});

router.use("/api", api_router);

export default router

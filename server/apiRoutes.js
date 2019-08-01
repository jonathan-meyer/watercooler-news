const express = require("express");
const moment = require("moment");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ now: moment() });
});

module.exports = router;

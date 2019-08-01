const express = require("express");
const moment = require("moment");

const router = express.Router();

router
  // default /api route that simply reutrns the current time
  .get("/", (req, res) => res.json({ now: moment() }))

  // model controllers
  .use("/articles", require("./articleController"))
  .use("/comments", require("./commentController"));

module.exports = router;

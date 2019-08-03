const express = require("express");

const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
  db.Comment.find((err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;

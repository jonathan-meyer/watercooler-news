const express = require("express");
const db = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
  db.Article.find((err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(data);
    }
  });
});

router.get("/:id", (req, res) => {
  db.Article.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (data) {
        res.json(data);
      } else {
        res.sendStatus(404);
      }
    }
  });
});

router.post("/", (req, res) => {
  db.Article.create(req.body, (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;

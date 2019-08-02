const crypto = require("crypto");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

const router = express.Router();

router.get("/scrape", (req, res) => {
  const base = "https://www.nytimes.com/section/us";
  axios
    .get(base)
    .then(({ data }) => {
      let $ = cheerio.load(data);
      let list = [];

      $("#stream-panel > div > ol > li").each(function() {
        const a = $(this).find("div > div > a");
        const h2 = a.find("h2");
        const p = a.find("p");
        const url = new URL(a.attr("href"), base).toJSON();
        const key = crypto
          .createHash("md5")
          .update(url, "utf8")
          .digest("hex");

        list.push(
          db.Article.findOneAndUpdate(
            { key },
            {
              headline: h2.text(),
              summary: p.text(),
              url,
              key
            },
            { new: true, upsert: true }
          ).exec()
        );
      });

      Promise.all(list)
        .then(data => res.json(data))
        .catch(err => {
          console.log({ err });
          res.status(500).json({ error: err.message });
        });
    })
    .catch(err => {
      console.log({ err });
      res.status(500).json({ error: err.message });
    });
});

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
  db.Article.findById(req.params.id)
    .populate("comments")
    .exec((err, data) => {
      if (err) {
        if (err.kind === "ObjectId") {
          res.sendStatus(404);
        } else {
          res.status(500).json(err);
        }
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

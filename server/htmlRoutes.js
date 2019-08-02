const path = require("path");
const express = require("express");

const router = express.Router();

router
  .use("/moment", express.static(path.resolve("node_modules", "moment", "min")))
  .use("/axios", express.static(path.resolve("node_modules", "axios", "dist")))
  .use(
    "/bootstrap",
    express.static(path.resolve("node_modules", "bootstrap", "dist"))
  )
  .use(
    "/jquery",
    express.static(path.resolve("node_modules", "jquery", "dist"))
  )
  .use(
    "/popper.js",
    express.static(path.resolve("node_modules", "popper.js", "dist"))
  )
  .use(
    "/jquery-validation",
    express.static(path.resolve("node_modules", "jquery-validation", "dist"))
  )

  .get("/", (req, res) => {
    res.render("index", {
      crumbs: [{ label: "Home", url: "/" }]
    });
  })

  .get("/article/:id", (req, res) => {
    res.render("article", {
      crumbs: [
        { label: "Home", url: "/" },
        { label: "Article", url: `/article/${req.params.id}` }
      ],
      article: req.params.id
    });
  })

  .use(express.static(path.resolve("public")));

module.exports = router;

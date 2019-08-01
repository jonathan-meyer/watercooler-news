const path = require("path");
const express = require("express");

const router = express.Router();

router
  .use("/bootstrap", express.static(path.resolve("node_modules", "bootstrap")))
  .use("/jquery", express.static(path.resolve("node_modules", "jquery")))
  .use("/popper.js", express.static(path.resolve("node_modules", "popper.js")))
  .use(
    "/jquery-validation",
    express.static(path.resolve("node_modules", "jquery-validation"))
  )

  .get("/", (req, res) => {
    res.render("index", {});
  })

  .use(express.static(path.resolve("public")));

module.exports = router;

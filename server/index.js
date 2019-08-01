const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const handlebars = exphbs.create({
  helpers: {
    gtOne: (value, opts) => (value > 1 ? opts.fn() : undefined),
    json: (value, opts) => JSON.stringify(value)
  }
});

const server = {
  start: (port, dbUri) => {
    const app = express()
      .engine("handlebars", handlebars.engine)
      .set("view engine", "handlebars")

      .use(express.urlencoded({ extended: true }))
      .use(express.json())

      .use((req, res, next) => {
        console.log(
          `${req.method} ${req.url} ${req.headers["content-type"] || ""}`
        );
        next();
      })

      .use("/api", require("./apiRoutes"))
      .use("/", require("./htmlRoutes"));

    mongoose
      .connect(dbUri, { useNewUrlParser: true })
      .then(() => {
        console.log("[Connected to DB]");

        app
          .listen(port, () => {
            console.log(`[Listening to port ${port}]`);
          })
          .on("close", () => {
            console.log(`[Stopped listening to port ${port}]`);

            mongoose.disconnect(() => {
              console.log("[Disconnected from DB]");
            });
          });
      })
      .catch(err => console.error(err));
  }
};

module.exports = server;

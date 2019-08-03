const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");
const favicon = require("serve-favicon");
const http = require("http");
const io = require("socket.io");
const joypixels = require("emoji-toolkit");

joypixels.imageTitleTag = false;
joypixels.emojiSize = 64;

const handlebars = exphbs.create({
  helpers: {
    gtOne: (value, opts) => (value > 1 ? opts.fn() : undefined),
    json: (value, opts) => JSON.stringify(value, null, 2),
    emoji: value => joypixels.toImage(value),
    bread: (context, options) =>
      context
        .slice(0, -1)
        .map(item => options.fn(item))
        .join(""),
    last: (context, options) =>
      context
        .slice(-1)
        .map(item => options.fn(item))
        .join(";")
  }
});

const server = {
  start: (port, dbUri) => {
    const app = express()
      .engine("handlebars", handlebars.engine)
      .set("view engine", "handlebars")

      .use(logger("dev"))
      .use(favicon(path.resolve(__dirname, "1f4dc.png")))

      .use(express.urlencoded({ extended: true }))
      .use(express.json())

      .use("/api", require("./apiRoutes"))
      .use("/", require("./htmlRoutes"));

    mongoose
      .connect(dbUri, { useNewUrlParser: true })
      .then(() => {
        console.log("[Connected to DB]");

        const server = http
          .createServer(app)
          .listen(port, () => {
            console.log(`[Listening to port ${port}]`);
          })
          .on("close", () => {
            console.log(`[Stopped listening to port ${port}]`);

            mongoose.disconnect(() => {
              console.log("[Disconnected from DB]");
            });
          });

        io(server).on("connection", socket => {
          console.log(`socket.io connected [${socket.json.id}]`);

          setInterval(() => {
            socket.emit("time", Date.now());
          }, 1000);
        });
      })
      .catch(err => console.error(err));
  }
};

module.exports = server;

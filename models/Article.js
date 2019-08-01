const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Article",
  new Schema({
    key: {
      type: String,
      required: true
    },
    headline: String,
    summary: String,
    url: String,
    date: {
      type: Date,
      default: Date.now()
    }
  })
);

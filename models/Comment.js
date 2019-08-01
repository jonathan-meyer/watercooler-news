const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Comment",
  new Schema({
    author: String,
    text: String,
    article: Schema.Types.ObjectId,
    date: {
      type: Date,
      default: Date.now()
    }
  })
);

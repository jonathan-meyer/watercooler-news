const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Comment",
  new Schema(
    {
      author: { type: String, required: true },
      text: { type: String, required: true }
    },
    { timestamps: {} }
  )
);

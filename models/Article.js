const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Article",
  new Schema(
    {
      key: { type: String, required: true },
      headline: { type: String, required: true },
      summary: { type: String, required: true },
      url: { type: String, required: true },
      comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
    },
    { timestamps: {} }
  )
);

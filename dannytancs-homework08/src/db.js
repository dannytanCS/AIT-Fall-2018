const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smashingSchema = new Schema({
  smashingText: String,
  length: Number,
  letterCounts: [{letter: String, count: Number}],
  sentiment: Number,
  date: String,
});

const Smashing = mongoose.model("Smashing", smashingSchema);

mongoose.connect("mongodb://localhost/homework08");

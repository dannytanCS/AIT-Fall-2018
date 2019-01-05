const mongoose = require('mongoose');

// my schema goes here!
const soundSchema = new mongoose.Schema({
    what: String,
    where: String,
    date: String,
    hour: Number,
    desc: String,
    session: String
});

mongoose.model("sounds", soundSchema);

mongoose.connect('mongodb://localhost/hw05');


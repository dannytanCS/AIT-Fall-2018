const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: {type: String, unique: true, required: true}
});

const articleSchema = new mongoose.Schema({
    title: String,
    url: String,
    description: String,
    username: String
});



// use plugins (for slug)
articleSchema.plugin(URLSlugs('title'));

// register your model

mongoose.model('User', userSchema);
mongoose.model('Article', articleSchema);

mongoose.connect('mongodb://localhost/hw06');

const mongoose = require('mongoose');

// my schema goes here!
const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    name: String,
    courses: [String]
});


const courseSchema = new mongoose.Schema({
    name: String,
    date: String, //in form of Fall 2018
    courseNumber: String,
    professor: String, 
    notes: [{
        name: String,
        id: String
    }]
});

const noteSchema = new mongoose.Schema({
    name: String,
    desc: String,
    date: String,
    file:  { data: Buffer, contentType: String }
});

mongoose.model("User", userSchema);
mongoose.model("Course", courseSchema);
mongoose.model('Note', noteSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/project';
}


mongoose.connect(dbconf);


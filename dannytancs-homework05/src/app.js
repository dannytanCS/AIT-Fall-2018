const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
require('./db');
const mongoose = require('mongoose');
const Sound = mongoose.model('sounds');


const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));


const sessionOptions = {
	secret: 'secret',
	resave: false,
	saveUninitialized: false
};
app.use(session(sessionOptions));

app.use((req, res, next) => {
    res.locals.user = req.user;
    if (req.session.count === undefined) {
        req.session.count = 1;
    }
    else {
        req.session.count ++;
    }
    next();
});



app.get('/', (req, res) => {
    const query = req.query;

    const objectsToFilter = {};
    if (query.what !== "" && query.what !== undefined) {
        objectsToFilter['what'] = query.what;
    }
    if (query.where !== "" && query.where !== undefined) {
        objectsToFilter['where'] = query.where;
    }
    if (query.date !== "" && query.date !== undefined) {
        objectsToFilter['date'] = query.date;
    }
    if (query.hour !== "" && query.hour !== undefined) {
        objectsToFilter['hour'] = query.hour;
    }

    if (Object.keys(objectsToFilter).length === 0) {
        Sound.find({}, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('sound', { sounds: result , count: req.session.count});
            }
        });
    }
    else {
        Sound.find(objectsToFilter, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('sound', { sounds: result, count: req.session.count });
            }
        });
    }
});


app.get('/sounds/add', (req, res) => {
    res.render('add', {count: req.session.count});
});

app.post('/sounds/add', (req, res) => {
    new Sound({
        what: req.body.what,
        where: req.body.where,
        date: req.body.date,
        hour: req.body.hour,
        desc: req.body.desc,
        session: req.session.id
    }).save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});

app.get('/sounds/mine', (req, res) => {
    Sound.find({session: req.session.id}, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('mine', { sessions:result, count: req.session.count });
        }
    });
});

app.listen(3000); 
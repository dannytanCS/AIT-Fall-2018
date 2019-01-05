const express = require('express');
const mongoose = require('mongoose');


require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');

const app = express();

app.set('view engine', 'hbs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

const Article = mongoose.model('Article');

// add req.session.user to every context object for templates
app.use((req, res, next) => {
    // now you can use {{user}} in your template!
    res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => {
    Article.find({}, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', { articles: result });
        }
    });
});

app.get('/article/add', (req, res) => {
    if (req.session.user) {
        res.render('article-add');
    }
    else {
        res.redirect('/login');
    }
});

app.post('/article/add', (req, res) => {
    if (req.session.user) {
        const title = req.body.title;
        const url = req.body.url;
        const desc = req.body.description;
        const username = req.session.user.username;
        const article = new Article({
            title: title,
            url: url,
            description: desc,
            username: username
        });
        article.save((err) => {
            if (err) {
                res.render('article-add', { message: 'Error in adding article' });
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

// come up with a url for /article/slug-name!
// app.get('add url here!', (req, res) => {
// });

app.get('/article/:slug', function (req, res) {
    Article.findOne({ slug: req.params.slug }, function (err, result) {
        res.render('article-detail', {article: result});
    });
});



app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const user = req.body.username;
    const email = req.body.email;
    const password = req.body.password;     
    auth.register(user, email, password, (err) => {
        res.render('register', err);
    }, (user) => {
        auth.startAuthenticatedSession(req, user, (err) => {
            res.redirect('/');
            console.log(err);
        });
    });

});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const user = req.body.username;
    const password = req.body.password;
    auth.login(user, password, (err) => {
        res.render('login', err);
    }, (user) => {
        auth.startAuthenticatedSession(req, user, (err) => {
            res.redirect('/');
            console.log(err);
        });
    });
});

app.get('/:username', function (req,res) {

    Article.find({username: req.params.username}, function (err, result) {
        res.render('user', {articles: result, username: req.params.username});
    });
});

app.listen(3000);

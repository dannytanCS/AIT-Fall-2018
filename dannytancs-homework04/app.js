const express = require("express");
const path = require("path");
const app = express();

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));


class Art {
    constructor(date, title, art, tags) {
        this.title = title;
        this.date = date;
        this.art = art;
        this.tags = tags;
    }
}


const logger = (req, res, next) => {
    console.log(req.method, req.path, req.query, req.body);
    next();
  };
  
app.use(logger);


const Arts = [
    new Art('2018-09-29', 'washington sq arch', `
    _______________
    |~|_________|~|
    |::::\\^o^/::::|
    ---------------
    |..|/     \\|..|
    ---        ----
    |  |       |  |
    |  |       |  |
    |  |       |  |
   .|__|.     .|__|.
   `, ['architecture', 'public']),


    new Art('2018-09-30', 'boba', `
        ______
        ======
       /      \\
      |        |-.
      |        |  \\
      |O.o:.o8o|_ /
      |.o.8o.O.|
       \\.o:o.o/
    `, ['snack', 'notmybestwork']),

    new Art('2018-10-31', 'buddy', `
       ___
      /  /\\   |---.
      |__|/__ |---,\\
      |  ` + "`   |=    `" + `
      |      /|
      |  .--' |
      |   |\\  |
      |   | \\ |
     /|   | | |
    \\/    |  \\|
___ /_____\\___|\\____
`, ['halloween', 'squad', 'fashion'])
];




app.get('/', (req, res) => {
    if (req.method === "GET" && Object.keys(req.query).length !== 0 && req.query['filter'] !== ""){
        const temp = [];
        // Arts.forEach(art => {
        //     art.tags.forEach(tag => {
        //         if (tag === req.query['filter']) {
        //             temp.push(art);
        //         }
        //     })
        // });
        for (let i = 0; i < Arts.length; i++) {
            for (let j = 0; j < Arts[i]['tags'].length; j++) {
                if (Arts[i]['tags'][j] === req.query['filter']) {
                    temp.push(Arts[i]);
                    break;
                }
            }
        }

        temp.reverse();
        res.render('art', {arts: temp});
    }
    else {
        const temp = Arts.slice().reverse();
        res.render('art', {arts: temp});
    }
});


app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req,res) => {
    const title = req.body['title'];
    const date = req.body['date'];
    const artBody = req.body['art'];
    const tag = req.body['tags'].split(" ");
    const art = new Art(date, title, artBody, tag);
    Arts.push(art);
    res.redirect("/");
});

app.listen(3000);
// app.js

const webby = require('./webby.js');
const path = require('path');
const app = new webby.App();
const fs = require('fs');

app.get('/', function(req, res) {
    const newPath = path.join(__dirname, '..', 'public', 'index.html');
    fs.readFile(newPath, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const ext = webby.getExtension(newPath);
            res.set("Content-Type", webby.MIME_TYPES[ext]);
            res.statusCode = 200;
            res.send(data);
        }
    });
});


function getData(count, target, res) {
    const newPath = path.join(__dirname, '..', 'public', 'img', 'animal'+ count + '.jpg');
    fs.readFile(newPath, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.sock.write('<img src= "./img/animal' + count + '.jpg" height="500" width="500" >');
            res.sock.write('\r\n');
            if (count === target) {
                res.end();
            }
            else {
                getData(count + 1, target, res);
            }
        }
    });
}

app.get('/gallery', function(req, res) {
     // 1 to 4
     const num = Math.floor((Math.random() * 4) + 1);

    res.set("Content-Type", 'text/html');
    res.statusCode = 200;

    res.sock.write(res.statusLineToString());
    res.sock.write(res.headersToString());
    res.sock.write("\r\n");
     
    res.sock.write("<h1> Here are " + num + " animal(s) </h1>");

    getData(1, num, res);
});


app.get('/pics', function(req, res) {
    req.path = "/gallery";
    res.statusCode = 308;
    res.set("Location", "/gallery");
    app.processRoutes(req, res);
});

app.use(webby.static(path.join(__dirname, '..', 'public')));

app.listen(3000, '127.0.0.1');



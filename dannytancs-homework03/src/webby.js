// webby.js

const path = require("path");
const net = require("net");
const fs = require('fs');

const HTTP_STATUS_CODES = {
    200: "OK",
    301: "Redirect",
    404: "Not Found",
    500: "Internal Server Error"
};

const MIME_TYPES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'html': "text/html",
    'css': "text/css",
    'text': "text/plain"
};

function getExtension(fileName) {
    const extension = path.extname(fileName).split(".");
    return extension[extension.length - 1].toLowerCase();
}

function getMIMEType(fileName) {
    const mimeType = MIME_TYPES[getExtension(fileName)];
    if (mimeType) {
        return mimeType;
    }
    return '';
}

class Request {
    constructor(httpRequest) {
      const request = httpRequest.split(' ');
      this.method = request[0];
      this.path = request[1];
    }
}

class Response {
    constructor(socket, statusCode = 200, version = "HTTP/1.1") {
        this.sock = socket;
        this.statusCode = statusCode;
        this.version = version;
        this.headers = {};
        this.body = null;
    }
    set(name, value) {
        this.headers[name] = value;
    }
    end() {
        this.sock.end();
    }
    statusLineToString() {
        return this.version + " " + this.statusCode + " " + HTTP_STATUS_CODES[this.statusCode] + "\r\n";
    }
    headersToString() {
        let string = "";
        for(const key in this.headers) {
            string += key + ": " + this.headers[key] + "\r\n";
        }
        return string;
    }
    send(body) {
        this.body = body;
        this.sock.write(this.statusLineToString());
        if (Object.keys(this.headers).length === 0) {
            this.set('Content-Type', 'text/html');
        }
        this.sock.write(this.headersToString());
        this.sock.write("\r\n");
        this.sock.write(body);
        this.end();
    }

    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
}

class App {
    constructor() {
        this.server = net.createServer(sock => this.handleConnection(sock));
        this.routes = {};
        this.middleware = null;
    }
    normalizePath(path) {
        let newPath = path.split("://");
        if (newPath.length === 1) {
            newPath = newPath[0];
        }
        else {
            newPath = newPath[1];
        }

        newPath = newPath.split("#")[0];
        newPath = newPath.split("?")[0];
        newPath = newPath.split("/");
        let normalPath = "/";
        for(let i = 1; i < newPath.length; i++) {
            if (newPath[i] === "") {
                continue;
            }
            normalPath += newPath[i] + "/";
        }
        const res = normalPath.slice(0, -1).toLowerCase();
        return res;
    }
    createRouteKey(method, path) {
        method = method.toUpperCase();
        return method + " " + this.normalizePath(path);
    }
    get(path, cb) {
        const key = this.createRouteKey("GET", path);
        this.routes[key] = cb;
    }

    use(cb) {
        this.middleware = cb;
    }

    listen(port, host) {
        this.server.listen(port, host);
    }
    handleConnection(sock) {
        sock.on('data', binaryData => {
            this.handleRequest(sock, binaryData);
        });
    }

    handleRequest(sock, binaryData) {
        const request = new Request(binaryData.toString());
        const response = new Response(sock);
        
        if (this.middleware) {
            this.middleware(request, response, this.processRoutes.bind(this));
        }
        else {
            this.processRoutes(request, response);
        }
    }

    processRoutes(req, res) {
        const path = req.path;
        const method = req.method;
        const key = this.createRouteKey(method, path);
        if (this.routes[key]) {
            this.routes[key](req,res);
        }
        else {
            res.set("Content-Type:", "text/plain");
            res.statusCode = 404;
            res.send("Page not found");
        }
    }
}


function serveStatic(basePath) {
    function newFunction(req, res, next) {
        const newPath = path.join(basePath, req.path);
        fs.readFile(newPath, (err, data) => {
            if (err) {
                next(req, res);
            } else {
                const ext = getExtension(newPath);
                res.set("Content-Type", MIME_TYPES[ext]);
                res.statusCode = 200;
                res.send(data);
            }
        });
    }
    return newFunction;
}

module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    MIME_TYPES: MIME_TYPES,
    getExtension: getExtension,
    getMIMEType: getMIMEType,
    Request: Request,
    App: App,
    Response: Response,
    static: serveStatic
};
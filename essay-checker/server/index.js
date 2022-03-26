const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const app = express();

// const port = 8080;

// app.use(cors({
//     origin: 'https://essaychecker.ru'
// }));
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

// app.all('*', [(req, res, next) => {
//     if (req.secure) {
//         // OK, continue
//         return next();
//     }
//     res.redirect('https://' + req.hostname + req.url);
// }]);

app.use(express.static('build'))

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);

    require('./app/routes')(app, database.db('EgeTest'));

    app.use('*', express.static(`${ __dirname }/build`));

    // var httpServer = http.createServer(app);
    // var httpsServer = https.createServer(credentials, app);
    // var httpsServer2 = https.createServer(credentials, app);

    // httpServer.listen(8080);
    http.createServer(app).listen(80);
    // httpsServer.listen(8443);
    https.createServer(credentials, app).listen(443);
})

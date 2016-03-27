require('dotenv').config({silent: true});

var express     = require('express'),
    app         = express(),
    compress    = require('compression'),
    http        = require('http'),
    server      = http.createServer(app),
    bodyParser  = require('body-parser'),
    config      = require('./config.js');

http.globalAgent.maxSockets = 10000;

server.listen(config.server.port, function () {
    console.info('ssheat listening on port: ' + config.server.port);
    console.info('app.env: ', app.get('env'));
});

/* Support gzip responses */
app.use(compress());

app.use(express.static(__dirname + '/views'));

/* Support json encoded bodies */
app.use(bodyParser.json());
/* Support encoded bodies */
app.use(bodyParser.urlencoded({extended: true}));

module.exports = app;
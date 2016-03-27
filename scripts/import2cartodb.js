require('dotenv').config({silent: true});

var config = require('../config.js');
var t2o = require('./text2object');
var request = require('superagent');
var fs = require('fs');

var apiKey = config.cartodb.api_key;
var account = config.cartodb.account;

var dirPending = 'scripts/authlogs/pending/';
var dirProcessed = 'scripts/authlogs/processed/';

var CartoDBImporter = {

    load: function () {
        fs.readdir(dirPending, function (err, files) {

            if (err) {
                console.error("Could not list directory.", err);
                return;
            }

            var meta = {};

            files.forEach(function (file, index) {

                meta[file] = [];

                var lineReader = require('readline').createInterface({
                    input: fs.createReadStream(dirPending + file)
                });

                lineReader.on('line', function (line) {
                    var row = t2o.extractFields(line);
                    if (row) {
                        var val = CartoDBImporter.toSQLValues(row);
                        if (val)
                            meta[file].push(val);
                    }
                });

                lineReader.on('close', function () {
                    fs.rename(dirPending + file, dirProcessed + file);
                    CartoDBImporter.import(meta[file]);
                })
            })
        });

    },

    toSQLValues: function (row) {
        if (!/[a-zA-Z0-9+_-]+/.test(row.username))
            return null;
        return "('" + row.date + "', '" + row.ip + "', '" + row.username + "')";
    },

    import: function (values) {
        var range = 80;

        for (var i = 0; i < values.length; i += range) {

            var sqlStatement = "INSERT INTO ssheat (date, ip, username) VALUES " + values.slice(i, i + range);
            var url = 'https://' + account + '.cartodb.com/api/v2/sql?q=' + sqlStatement + '&api_key=' + apiKey;

            setTimeout((function (u) {
                request.get(u).end(function (err, res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(res.body);
                })
            })(url), 2000)

        }
    }
};

CartoDBImporter.load();

module.exports = CartoDBImporter;
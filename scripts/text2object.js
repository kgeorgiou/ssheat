var moment = require('moment');

var FieldsExtractor = {

    extractFields : function(line) {

        if (line.indexOf("Invalid user") < 0)
            return undefined;

        var fields = line.split(" ");

        if (fields.length != 10)
            return undefined;

        var concDate = fields[0] + " " + fields[1] + " " + fields[2];
        var date = moment(concDate, "MMM DD HH:mm:ss").toISOString();

        return {
            date: date,
            username: fields[7],
            ip: fields[9]
        }
    }

};

module.exports = FieldsExtractor;
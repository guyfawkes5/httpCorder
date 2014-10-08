var settings = require('../settings.json'),

    mongoose = require('mongoose'),
    Q = require('q'),

    schema = require('./schema.js'),
    utils = require('../utils.js'),
    BodyWritable = require('../class/BodyWritable.js'),

    connection = mongoose.connection,
    Schema = mongoose.Schema,

    Exchange = mongoose.model('Exchange', new Schema(schema)),
	
    errorLogger = function (message) {
        console.error(message);
    },
	
    bufferBody = {
        transform: function (doc) {
            console.log('Relaying ' + doc.request.url);
            return Buffer.concat(doc.body);
        }
    };
	
module.exports = {
	connect: function(address, callback) {
		connection.once('open', callback);
		connection.on('error', errorLogger);
		mongoose.connect(address);
	},
    has: function (request) {
        var filteredRequest = request.toQuery(Exchange.schema, 'request'),
            query = Exchange.findOne(filteredRequest),
            has = Q.defer();
        query.exec(function (err, match) {
			if (!match || err) {
				has.reject();
			} else {
				has.resolve(utils.apply(match.response, {
					stream: function() {
						return query.stream(bufferBody);
					}
				}));
			}
		});
		return has.promise;
	},
    getWritableStream: function (data, response) {
        console.log(response.toSchema(Exchange.schema));
        return new BodyWritable(Exchange, data);
	}
};
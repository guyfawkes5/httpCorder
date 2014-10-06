var settings = require('./settings.json'),

    mongoose = require('mongoose'),
    connection = mongoose.connection,
    Schema = mongoose.Schema,
	
    schema = require('./schema'),

    Exchange = mongoose.model('Exchange', new Schema(schema)),
	
    Q = require('q'),
    utils = require('./utils'),

    BodyWritable = require('./class/BodyWritable.js'),
	
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
		connection.once('open', function() {
			callback(mongoose);
		});
		connection.on('error', errorLogger);
		mongoose.connect(address);
	},
	has: function(request) {
		var query = Exchange.findOne({ 'request.url': request.url }),
            has = Q.defer();
        query.exec(function (err, match) {
			if (!match || err) {
				has.reject();
			} else {
				has.resolve(utils.apply(match, {
					stream: function() {
						return query.stream(bufferBody);
					}
				}));
			}
		});
		return has.promise;
	},
	getWritableStream: function (data) {
        return new BodyWritable(Exchange, data);
	}
};
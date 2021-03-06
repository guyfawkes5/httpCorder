var settings = require('../settings.json'),

	mongoose = require('mongoose'),
	Q = require('q'),

	schema = require('./schema.js'),
	utils = require('../utils.js'),
	BodyWritable = require('../class/BodyWritable.js'),

	connection = mongoose.connection,
	Schema = mongoose.Schema,

	Exchange = mongoose.model('Exchange', new Schema(schema, {
        strict: true,
        minimize: false,
        toObject: {
            retainKeyOrder: true
        }
    })),
	
	errorLogger = function (message) {
		console.error(message);
	},
	
	bufferBody = {
		transform: function (doc) {
			return Buffer.concat(doc.body);
		}
	};

module.exports = {
	connect: function(address, callback) {
		connection.once('open', callback);
		connection.on('error', errorLogger);
		mongoose.connect(address);
	},
	has: function(req) {
		var filteredRequest = req.parseURL().mask(settings.requestMask).toQuery(schema, 'request'),
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
	getWritableStream: function(req, res) {
		var maskedReq = req.parseURL().mask(settings.requestMask),
			schemaData = {
				request: utils.filter(maskedReq, schema.request, 0),
				response: utils.filter(res, schema.response, 0)
			};

		return new BodyWritable(Exchange, schemaData);
	}
};
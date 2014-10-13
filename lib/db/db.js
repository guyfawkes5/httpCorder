var settings = require('../settings.json'),

	mongoose = require('mongoose'),
	Q = require('q'),
	url = require('url'),

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
	has: function (request) {
		var filteredRequest = generateQuery(request, schema, 'request'),
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
	getWritableStream: function (proxyResp) {
		var data = generateSchemaData(schema, proxyResp);
		return new BodyWritable(Exchange, data);
	}
};

function generateQuery(data, schemaObject, prefix) {
	var query = {},
		schema = (prefix ? schemaObject[prefix] : schemaObject),
		queryPrefix = (prefix ? prefix + '.' : '');

	parseURL(data);

	utils.each(schema, function(prop) {
		query[queryPrefix + prop] = data[prop];
	});

	return query;
}

function parseURL(request) {
	request.url = request.url || request.path;

	var parsedURL = url.parse(request.url, true);

	request.query = parsedURL.query;
	request.pathName = parsedURL.pathname;
}

function generateSchemaData(schema, response) {
	parseURL(response.req);
	return {
		request: utils.filter(response.req, schema.request),
		response: utils.filter(response, schema.response)
	};
}
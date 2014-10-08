var settings = require('./settings.json'),

    httpProxy = require('http-proxy'),
	
    db = require('./db/db.js'),
    utils = require('./utils.js'),

    proxy,
    protocol = /http(s)?:\/\//;

proxy = httpProxy.createServer({
    target: settings.targetURI
});

module.exports = function (request, response) {
    request.headers.host = getTargetHost();
    proxy.web(request, response);
};

proxy.on('proxyRes', function (response) {
    var data = {
        request: response.req,
        response: response
    },
        dbStream = db.getWritableStream(data, response);
    response.pipe(dbStream);
});

function getTargetHost() {
    return settings.targetURI.replace(protocol, '');
}
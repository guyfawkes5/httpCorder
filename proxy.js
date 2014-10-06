var settings = require('./settings.json'),

    httpProxy = require('http-proxy'),
    proxy = httpProxy.createServer({
        target: settings.targetURI
    }),
	
    db = require('./db'),
    utils = require('./utils.js');

module.exports = function (request, response) {
    request.headers.host = request.headers.host.replace(/http(s)?:\/\//, '');
    proxy.web(request, response);
};

proxy.on('proxyRes', function (response) {
    var data = {
        request: response.req,
        response: response
    };
    var dbStream = db.getWritableStream(data);
    response.pipe(dbStream);
});
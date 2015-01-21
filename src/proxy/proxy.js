var settings = require('../settings.json'),

    url = require('url'),

    httpProxy = require('http-proxy'),

    protocol = /http(s)?:\/\//;
    proxy = httpProxy.createServer({
        target: settings.server.targetURI,
        secure: false
    });

module.exports = {
    web: function(request, response) {
        request.headers.host = getTargetHost();
        proxy.web(request, response);
    },
    onResponse: function(listener) {
        proxy.on('proxyRes', function(res) {
            var req = res.req;

            req._parsedUrl = url.parse(req.path, true);

            listener(req, res);
        });
    }
};

function getTargetHost() {
    return settings.server.targetURI.replace(protocol, '');
}
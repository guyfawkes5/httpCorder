var settings = require('../settings.json'),

    httpProxy = require('http-proxy'),

    protocol = /http(s)?:\/\//;
    proxy = httpProxy.createServer({
        target: settings.targetURI
    });

module.exports = {
    web: function(request, response) {
        request.headers.host = getTargetHost();
        proxy.web(request, response);
    },
    getServer: function() {
        return proxy;
    }
};

function getTargetHost() {
    return settings.targetURI.replace(protocol, '');
}
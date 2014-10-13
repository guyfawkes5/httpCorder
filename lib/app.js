var settings = require('./settings.json'),

    http = require('http'),

    db = require('./db/db.js'),
    proxy = require('./proxy/proxy.js'),

    server;

require('./ext/http.js');

server = http.createServer(function (request, response) {
    this.emit('beforeRequest', request);
    db.has(request).then(
        function(storedResponse) {
            server.emit('beforeStoredResponse', request, storedResponse);
            response.writeHead(storedResponse.statusCode, storedResponse.headers);
            storedResponse.stream().pipe(response);
        },
        function() {
            server.emit('beforeProxy', request);
            proxy.web(request, response);
        }
    );
});

proxy.getServer().on('proxyRes', function (response) {
    var dbStream = db.getWritableStream(response);
    response.pipe(dbStream);
});

db.connect(settings.dbURI, function() {
    server.listen(settings.port);
    console.log('Listening on localhost:' + settings.port);
});

process.argv.forEach(function(val) {
    if (val === 'debug') {
        server.on('beforeRequest', function (request) {
            console.log('Request for ' + request.url);
        }).on('beforeStoredResponse', function (request, storedResp) {
            console.log('Stored response found for ' + request.url);
        }).on('beforeProxy', function (request) {
            console.log('Proxying for ' + request.url);
        });
        proxy.getServer().on('proxyRes', function (response) {
            console.log('Proxy response for ' + response.req.path);
        });
    }
});
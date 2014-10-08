var settings = require('./settings.json'),

    http = require('http'),

    db = require('./db/db.js'),
    proxy = require('./proxy.js'),
    utils = require('./utils.js'),
    extendHTTP = require('./ext/http.js'),

    server;

server = http.createServer(function (request, response) {
    this.emit('beforeRequest', request);
    db.has(request).then(
        function(storedResponse) {
            console.log('Found ' + request.url);
            response.writeHead(storedResponse.statusCode, storedResponse.headers);
            storedResponse.stream().pipe(response);
        },
        function() {
            console.log('Proxying ' + request.url);
            proxy(request, response);
        }
    );
});

db.connect(settings.dbURI, function() {
    server.listen(settings.port);
    console.log('Listening on localhost:' + settings.port);
});

extendHTTP(http);
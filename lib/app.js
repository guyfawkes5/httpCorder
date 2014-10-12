var settings = require('./settings.json'),

    http = require('http'),

    db = require('./db/db.js'),
    proxy = require('./proxy/proxy.js'),

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
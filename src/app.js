var settings = require('./settings.json'),

    express = require('express'),

    db = require('./db/db.js'),
    proxy = require('./proxy/proxy.js'),

    app = express(),

    proxyRouter = express.Router();

require('./ext/http.js');

proxyRouter.use(function(req, res, next) {
    db.has(req).then(function(storedResponse) {
        console.log('Stored response ' + req.url);
        res.status(storedResponse.statusCode).header(storedResponse.headers);
        storedResponse.stream().pipe(res);
    }, next);
});

proxyRouter.use(function(req, res, next) {
    console.log('Proxying for ' + req.url);
    if (settings.server.req) {
        proxy.web(req, res);
    } else {
        res.status(404).end();
    }
});

app.use(proxyRouter);

proxy.onResponse(function(req, res) {
    var dbStream = db.getWritableStream(req, res);
    res.pipe(dbStream);
});

db.connect(settings.dbURI, function() {
    app.listen(settings.port, function() {
        console.log('Listening on localhost:' + settings.port);
    });
});
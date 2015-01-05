var settings = require('./settings.json'),

    express = require('express'),

    db = require('./db/db.js'),
    proxy = require('./proxy/proxy.js'),

    app = express(),

    router = express.Router();

require('./ext/http.js');

router.use(function(req, res, next) {
    db.has(req).then(function(storedResponse) {
        console.log('Stored response ' + req.pathName);
        res.status(storedResponse.statusCode).header(storedResponse.headers);
        storedResponse.stream().pipe(res);
    }, next);
});

router.use(function(req, res, next) {
    console.log('Proxying for ' + req.pathName);
    if (settings.proxy) {
        proxy.web(req, res);
    } else {
        res.status(404).end();
    }
});

app.use(router);

proxy.getServer().on('proxyRes', function (res) {
    var dbStream = db.getWritableStream(res);
    res.pipe(dbStream);
});

db.connect(settings.dbURI, function() {
    app.listen(settings.port, function() {
        console.log('Listening on localhost:' + settings.port);
    });
});
var http = require('http'),
    url = require('url'),

    utils = require('./../utils.js');

http.IncomingMessage.prototype.toQuery = function(schema, prefix) {
    var query = {},
        req = this,
        prefixStr = prefix ? prefix + '.' : '';

    utils.each(schema[prefix], function(prop) {
        query[prefixStr + prop] = req[prop];
    });

    return query;
};

function parseURL() {
    this.query = this._parsedUrl.query || {};
    this.pathName = this._parsedUrl.pathname;

    return this;
}

http.IncomingMessage.prototype.parseURL = parseURL;
http.ClientRequest.prototype.parseURL = parseURL;

function mask(maskObj) {
    return utils.mask(this, maskObj);
}

http.IncomingMessage.prototype.mask = mask;
http.ClientRequest.prototype.mask = mask;
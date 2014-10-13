var http = require('http'),
    url = require('url'),

    utils = require('./../utils.js');

http.IncomingMessage.prototype.getReq = function() {
    return this.req;
};

http.IncomingMessage.prototype.toQuery = function(schema) {
    var request = this,
        query = {},
        reqSchema = schema.request;

    utils.each(reqSchema, function(prop) {
        query['request.' + prop] = request[prop];
    });

    return query;
};

http.IncomingMessage.prototype.toSchema = function(schema) {
    return {
        request: utils.filter(this.req, schema.request),
        response: utils.filter(this, schema.response)
    };
};

function parseURL() {
    this.url = this.url || this.path;

    var parsedURL = url.parse(this.url, true);

    this.query = parsedURL.query;
    this.pathName = parsedURL.pathname;

    return this;
}

http.IncomingMessage.prototype.parseURL = parseURL;
http.ClientRequest.prototype.parseURL = parseURL;

function mask(maskObj) {
    return utils.mask(this, maskObj);
}

http.IncomingMessage.prototype.mask = mask;
http.ClientRequest.prototype.mask = mask;
var Writable = require('stream').Writable,
    util = require('util'),
    utils = require('../utils.js');

module.exports = BodyWritable;

util.inherits(BodyWritable, Writable);

function BodyWritable(Model, data) {
    this.Model = Model;
    this.data = data;
    this._write = this._initialWrite;
    Writable.call(this);
}

BodyWritable.prototype._initialWrite = function (chunk, enc, cb) {
    this.data = {
        request: {
            url: this.data.request.path,
            method: this.data.request.method
        },
        response: {
            statusCode: this.data.response.statusCode,
            headers: this.data.response.headers
        }
    };
    console.log('Creating ' + this.data.request.url);
    this.Model.create(utils.apply({ body: [chunk] }, this.data), cb);
    this._write = this._subsequentWrite;
};

BodyWritable.prototype._write = BodyWritable.prototype._initialWrite;

BodyWritable.prototype._subsequentWrite = function (chunk, enc, cb) {
    console.log('Pushing ' + this.data.request.url);
    this.Model.update({'request.url': this.data.request.url}, { $push: { body: chunk } }, cb);
};
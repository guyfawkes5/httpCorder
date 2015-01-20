var Writable = require('stream').Writable,
    util = require('util');

module.exports = BodyWritable;

util.inherits(BodyWritable, Writable);

function BodyWritable(Model, data) {
    this.doc = new Model(data);
    Writable.call(this);
    this.write(new Buffer(0));
}

BodyWritable.prototype._initialWrite = function (chunk, enc, cb) {
    console.log('Saving ' + this.doc.request.pathName);
    this.doc.save(cb);
    this._write = this._subsequentWrite;
};

BodyWritable.prototype._write = BodyWritable.prototype._initialWrite;

BodyWritable.prototype._subsequentWrite = function (chunk, enc, cb) {
    this.doc.update({ $push: { body: chunk } }, cb);
};
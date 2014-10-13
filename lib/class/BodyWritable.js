var Writable = require('stream').Writable,
    util = require('util');

module.exports = BodyWritable;

util.inherits(BodyWritable, Writable);

function BodyWritable(Model, data) {
    this.doc = new Model(data);
    Writable.call(this);
    this._writableState.needDrain = true;
    this.doc.save(function() {
        this.emit('drain');
    });
}

BodyWritable.prototype._write = function (chunk, enc, cb) {
    this.doc.update({ $push: { body: chunk }}, cb);
};
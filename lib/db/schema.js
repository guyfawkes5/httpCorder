var Schema = require('mongoose').Schema;

module.exports = {
    request: {
        pathName: String,
        query: Schema.Types.Mixed,
        method: String
    },
    response: {
        statusCode: Number,
        headers: {}
    },
    body: {type: [Buffer], default: []}
};
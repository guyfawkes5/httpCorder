module.exports = {
    request: {
        url: String,
        method: String
    },
    response: {
        statusCode: Number,
        headers: {}
    },
    body: [Buffer]
};
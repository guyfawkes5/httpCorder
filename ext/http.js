var util = require('util'),
    
    utils = require('../utils.js'),

    systemPath = /^_/,
    idPath = /^id$/;

module.exports = function (http) {
    http.IncomingMessage.prototype.toQuery = function (schema, path) {
        var request = this,
            filtered = {},
            path = new RegExp('^' + path + '.'),
            subPath;
        
        schema.eachPath(function (pathName, field) {
            if (!systemPath.test(pathName) && path.test(pathName)) {
                subPath = pathName.replace(path, '');
                filtered[pathName] = request[subPath];
            }
        });
        
        return filtered;
    };
    http.IncomingMessage.prototype.toSchema = function (schema) {
        utils.each(schema.tree, function (pathName, field) {
            if ( !(systemPath.test(pathName) && util.isArray(field) && idPath.test(field)) ) {
                utils.each(function (subPath) {

                });
            }
        });
    };
};
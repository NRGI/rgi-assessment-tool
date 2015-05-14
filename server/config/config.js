/*jslint nomen: true */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        db: 'mongodb://localhost/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    development: {
        db: '@candidate.32.mongolayer.com:10582/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        db: '@candidate.32.mongolayer.com:10582/rgi2015_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        db: '@candidate.32.mongolayer.com:10582/rgi_pilot',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
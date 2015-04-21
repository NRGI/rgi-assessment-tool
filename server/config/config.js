/*jslint nomen: true */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        db: 'mongodb://localhost/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
<<<<<<< HEAD
    development_local: {
        db: '@candidate.32.mongolayer.com:10582/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    development_server: {
=======
    development: {
>>>>>>> master
        db: '@candidate.32.mongolayer.com:10582/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        db: '@candidate.32.mongolayer.com:10582/rgi2015_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
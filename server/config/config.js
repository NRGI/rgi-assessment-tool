/*jslint nomen: true */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        db: 'mongodb://localhost/rgi_local',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    //local: {
    //    db: '@candidate.32.mongolayer.com:10582/mga_production',
    //    rootPath: rootPath,
    //    port: process.env.PORT || 3030
    //},
    staging: {
        db: '@candidate.32.mongolayer.com:10582/rgi_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        db: '@candidate.32.mongolayer.com:10582/rgi_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        db: '@candidate.32.mongolayer.com:10582/rgi_pilot',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};

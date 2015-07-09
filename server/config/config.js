/*jslint nomen: true */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        db: 'mongodb://localhost/rgi_local',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    development: {
<<<<<<< HEAD
        db: '@c726.candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_dev?replicaSet=set-54c2868c4ae1de388800b2a3',
=======
        db: '@c726.candidate.19.mongolayer.com:10726/rgi_dev',
>>>>>>> staging
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        db: '@candidate.32.mongolayer.com:10582/rgi_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        db: '@c726.candidate.19.mongolayer.com:10726/rgi_pilot',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};

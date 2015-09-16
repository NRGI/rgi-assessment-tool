/*jslint nomen: true */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        baseUrl: 'http://localhost:3030',
        db: 'mongodb://localhost/rgi_local',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    development: {
        baseUrl: 'http://rgiassessmenttool.elasticbeanstalk.com',
        db: '@c726.candidate.19.mongolayer.com:10726/rgi_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        baseUrl: 'http://rgiassessmenttool.elasticbeanstalk.com',
        db: '@candidate.32.mongolayer.com:10582/rgi_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        baseUrl: 'http://rgiassessmenttool.elasticbeanstalk.com',
        db: '@c726.candidate.19.mongolayer.com:10726/rgi_pilot',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};

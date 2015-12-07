'use strict';
var path        = require('path'),
    rootPath    = path.normalize(__dirname + '/../../');

module.exports = {
    local: {
        baseUrl: 'http://localhost:3030',
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
        baseUrl: 'http://rgi-staging.nrgi-assessment.org',
        db: '@candidate.32.mongolayer.com:10582/rgi_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        baseUrl: 'http://rgi.nrgi-assessment.org',
        db: '@candidate.32.mongolayer.com:10582/rgi_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        baseUrl: 'http://rgi-pilot.nrgi-assessment.org',
        db: '@candidate.32.mongolayer.com:10582/rgi_pilot',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    new_data: {
        baseUrl: 'http://rgi-new-data.nrgi-assessment.org',
        db: '@candidate.32.mongolayer.com:10582/rgi_dev',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
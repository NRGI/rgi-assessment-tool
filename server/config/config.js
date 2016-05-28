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
    test: {
        baseUrl: 'http://localhost:3131',
        db: 'mongodb://localhost/rgi_local',
        rootPath: rootPath,
        port: process.env.PORT || 3131
    },
    //local: {
    //    db: '@candidate.32.mongolayer.com:10582/mga_production',
    //    rootPath: rootPath,
    //    port: process.env.PORT || 3030
    //},
    staging: {
        baseUrl: 'http://rgi-staging.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_dev?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    staging_2: {
        baseUrl: 'http://rgi-staging_2.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_dev_2?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    question_staging: {
        baseUrl: 'http://rgi-question-staging.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_question_staging?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        baseUrl: 'http://rgi.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_production?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        baseUrl: 'http://rgi-pilot.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_pilot?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    new_data: {
        baseUrl: 'http://rgi-new-data.nrgi-assessment.org',
        db: '@candidate.19.mongolayer.com:10726,candidate.32.mongolayer.com:10582/rgi_dev?replicaSet=set-54c2868c4ae1de388800b2a3',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
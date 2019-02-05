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
        db: 'mongodb://localhost/rgi_test',
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
        db: '@rgi-assessment-tool-shard-00-00-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-01-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-02-xscpv.mongodb.net:27017/rgi_dev?ssl=true&replicaSet=rgi-assessment-tool-shard-0&authSource=admin',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    question_staging: {
        baseUrl: 'http://rgi-question-staging.nrgi-assessment.org',
        db: '@rgi-assessment-tool-shard-00-00-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-01-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-02-xscpv.mongodb.net:27017/rgi_question_staging?ssl=true&replicaSet=rgi-assessment-tool-shard-0&authSource=admin',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    production: {
        baseUrl: 'http://rgi.nrgi-assessment.org',
        db: '@rgi-assessment-tool-shard-00-00-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-01-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-02-xscpv.mongodb.net:27017/rgi_production?ssl=true&replicaSet=rgi-assessment-tool-shard-0&authSource=admin',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    pilot: {
        baseUrl: 'http://rgi-pilot.nrgi-assessment.org',
        db: '@rgi-assessment-tool-shard-00-00-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-01-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-02-xscpv.mongodb.net:27017/rgi_pilot?ssl=true&replicaSet=rgi-assessment-tool-shard-0&authSource=admin',
        rootPath: rootPath,
        port: process.env.PORT || 80
    },
    new_data: {
        baseUrl: 'http://rgi-new-data.nrgi-assessment.org',
        db: '@rgi-assessment-tool-shard-00-00-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-01-xscpv.mongodb.net:27017,rgi-assessment-tool-shard-00-02-xscpv.mongodb.net:27017/rgi_dev?ssl=true&replicaSet=rgi-assessment-tool-shard-0&authSource=admin',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
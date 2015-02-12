var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/rgi2015_dev',
        // db: '@c726.candidate.19.mongolayer.com:10726,c582.candidate.32.mongolayer.com:10582/rgi2015_dev',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        db: 'mongodb://localhost/rgi2015_production',
        // db: '@c726.candidate.19.mongolayer.com:10726,c582.candidate.32.mongolayer.com:10582/rgi2015_production',
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
};
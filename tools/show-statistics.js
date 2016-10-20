'use strict';

const
    fs = require('fs'),
    path = require('path'),
    url = require('url')
;

const filePath = require('./file-path');
const logger = require('./logger');

var fileName = filePath.getInputFilePath();

fs.readFile(fileName, 'utf8', function (dataError, serializedData) {
    if(dataError) {
        logger.log('read document list error');
    } else {
        var statistics = {};

        JSON.parse(serializedData).forEach(function(record) {
            var extension = path.extname(url.parse(record.s3_url).pathname).toLowerCase();

            if(statistics[extension] === undefined) {
                statistics[extension] = 0;
            }

            statistics[extension]++;
        });

        console.log(JSON.stringify(statistics));
    }
});

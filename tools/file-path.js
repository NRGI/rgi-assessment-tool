'use strict';

var getFileAbsolutePath = function(folderName, fileSubPath) {
    return __dirname + '/' + folderName + '/' + fileSubPath + '.json';
};

exports.getInputFilePath = function(env) {
    return getFileAbsolutePath('input', env);
};

exports.getOutputFilePath = function(env, fileName) {
    return getFileAbsolutePath('output', env + '/' + fileName);
};

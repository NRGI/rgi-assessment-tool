'use strict';

var mongoose = require('mongoose'),
    sinon = require('sinon');

var modelStub = sinon.stub(mongoose, 'model', function() {});

module.exports = {
    getControllerPath: function(controller) {
        return '../../../../server/controllers/' + controller;
    },
    restoreModel: function() {
        modelStub.restore();
    },
    setModuleLocalVariable: function(moduleObject, variableName, variableValue) {
        moduleObject.__set__(variableName, variableValue);
    }
};

'use strict';

var mongoose = require('mongoose'),
    sinon = require('sinon');

var modelStub,
    getUnitPath = function(unitType, unitName) {
        return '../../../../server/' + unitType + '/' + unitName;
    };

module.exports = {
    getControllerPath: function(controller) {
        return getUnitPath('controllers', controller);
    },
    getModelPath: function(model) {
        return getUnitPath('models', model);
    },
    getUtilityPath: function(utility) {
        return getUnitPath('utilities', utility);
    },
    restoreModel: function() {
        modelStub.restore();
    },
    setModuleLocalVariable: function(moduleObject, variableName, variableValue) {
        moduleObject.__set__(variableName, variableValue);
    },
    stubModel: function() {
        modelStub = sinon.stub(mongoose, 'model', function() {});
    }
};

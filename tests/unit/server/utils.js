'use strict';

var mongoose = require('mongoose'),
    sinon = require('sinon');

var modelStub,
    getUnitPath = function(unitType, unitName) {
        return '../../../../server/' + unitType + '/' + unitName;
    };

module.exports = {
    getConfigPath: function(moduleName) {
        return getUnitPath('config', moduleName);
    },
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
    getModuleLocalVariable: function(moduleObject, variableName) {
        return moduleObject.__get__(variableName);
    },
    setModuleLocalVariable: function(moduleObject, variableName, variableValue) {
        moduleObject.__set__(variableName, variableValue);
    },
    stubModel: function(skippedModelNames) {
        var originalModels = {};

        (skippedModelNames || []).forEach(function(modelName) {
            originalModels[modelName] = mongoose.model(modelName);
        });

        modelStub = sinon.stub(mongoose, 'model', function(modelName) {
            return Object.keys(originalModels).indexOf(modelName) === -1 ? undefined : originalModels[modelName];
        });
    }
};

'use strict';

angular.module('app')
    .factory('rgiResourcesMethodSrvc', ['rgiResourceProcessorSrvc', 'rgiResourcesSrvc', function (
        rgiResourceProcessorSrvc,
        rgiResourcesSrvc
    ) {
        return {
            createResource: function (newResourceData) {
                return rgiResourceProcessorSrvc.process(new rgiResourcesSrvc(newResourceData), '$save');
            },
            updateResource: function (resource) {
                return rgiResourceProcessorSrvc.process(resource, '$update');
            },
            deleteResource: function (resourceId) {
                return rgiResourceProcessorSrvc.delete(rgiResourcesSrvc, resourceId);
            }
        };
    }]);

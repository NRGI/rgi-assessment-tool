'use strict';

angular.module('app').factory('rgiResourceProcessorSrvc', ['$q', 'rgiHttpResponseProcessorSrvc', function ($q, rgiHttpResponseProcessorSrvc) {
    var resourceProcessor = {
        getResponseHandler: function(dfd) {
            return function (response) {
                if(response.reason) {
                    dfd.reject(response.reason);
                } else {
                    dfd.resolve(response);
                }
            };
        },
        process: function(object, method) {
            var dfd = $q.defer();

            object[method]().then(resourceProcessor.getResponseHandler(dfd),
                rgiHttpResponseProcessorSrvc.getDeferredHandler(dfd));

            return dfd.promise;
        },
        delete: function(className, objectId) {
            var object = new className();
            object.id = objectId;
            return resourceProcessor.process(object, '$delete');
        }
    };

    return resourceProcessor;
}]);

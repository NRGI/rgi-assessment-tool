'use strict';

angular.module('app').factory('rgiResourceProcessorSrvc', function ($q, rgiHttpResponseProcessorSrvc) {
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
        getErrorHandler: function(dfd) {
            return function (response) {
                dfd.reject(rgiHttpResponseProcessorSrvc.getMessage(response));
                rgiHttpResponseProcessorSrvc.handle(response);
            };
        },
        process: function(object, method) {
            var dfd = $q.defer();
            object[method]().then(resourceProcessor.getResponseHandler(dfd), resourceProcessor.getErrorHandler(dfd));
            return dfd.promise;
        },
        delete: function(className, objectId) {
            var object = new className();
            object.id = objectId;
            return resourceProcessor.process(object, '$delete');
        }
    };

    return resourceProcessor;
});

'use strict';

angular.module('app').factory('rgiHttpResponseProcessorSrvc', ['$location', 'rgiIdentitySrvc', 'rgiNotifier', function (
    $location,
    rgiIdentitySrvc,
    rgiNotifier
) {
    var handledFailuresNumber = 0,
        handleByDefault = function(response, alternativeMessage, showMessage) {
            showMessage(httpResponseProcessor.getMessage(response, alternativeMessage));
            httpResponseProcessor.handle(response);
        },
        httpResponseProcessor = {
            getDefaultHandler: function(alternativeMessage) {
                return function(response) {
                    handleByDefault(response, alternativeMessage, rgiNotifier.error);
                };
            },
            getDeferredHandler: function(dfd, alternativeMessage) {
                return function(response) {
                    handleByDefault(response, alternativeMessage, dfd.reject);
                };
            },
            getNotRepeatedHandler: function(alternativeMessage) {
                return function(response) {
                    if(httpResponseProcessor.getHandledFailuresNumber() === 0) {
                        httpResponseProcessor.getDefaultHandler(alternativeMessage)(response);
                    }
                };
            },
            getHandledFailuresNumber: function() {
                return handledFailuresNumber;
            },
            getMessage: function(response, defaultMessage) {
                switch (response.status) {
                    case 403:
                        return 'Please, re-login';
                    default:
                        if(defaultMessage !== undefined) {
                            return defaultMessage;
                        }

                        if(response.data) {
                            if(response.data.reason !== undefined) {
                                return response.data.reason;
                            } else if(response.data.length > 0) {
                                return response.data;
                            }
                        }

                        return 'Unknown error occurred';
                }
            },
            handle: function(response) {
                handledFailuresNumber++;

                if(response.status === 403) {
                    rgiIdentitySrvc.currentUser = undefined;
                    $location.path('/');
                }
            },
            resetHandledFailuresNumber: function() {
                handledFailuresNumber = 0;
            }
        };

    return httpResponseProcessor;
}]);

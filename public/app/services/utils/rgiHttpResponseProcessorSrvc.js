'use strict';

angular.module('app').factory('rgiHttpResponseProcessorSrvc', function (
    $location,
    rgiIdentitySrvc,
    rgiNotifier
) {
    var handledFailuresNumber = 0,
        httpResponseProcessor = {
            getDefaultHandler: function(alternativeMessage) {
                return function(response) {
                    rgiNotifier.error(httpResponseProcessor.getMessage(response, alternativeMessage));
                    httpResponseProcessor.handle(response);
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
                        } else if(response.data.reason !== undefined) {
                            return response.data.reason;
                        } else if(response.data.length > 0) {
                            return response.data;
                        } else {
                            return 'Unknown error occurred';
                        }
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
});

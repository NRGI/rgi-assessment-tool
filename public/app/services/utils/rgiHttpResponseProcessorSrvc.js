'use strict';

angular.module('app').factory('rgiHttpResponseProcessorSrvc', function (
    $location,
    rgiIdentitySrvc
) {
    return {
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
            if(response.status === 403) {
                rgiIdentitySrvc.currentUser = undefined;
                $location.path('/');
            }
        }
    };
});

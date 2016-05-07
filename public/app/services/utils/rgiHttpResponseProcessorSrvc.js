'use strict';

angular.module('app').factory('rgiHttpResponseProcessorSrvc', function (
    $location,
    rgiIdentitySrvc
) {
    return {
        getMessage: function(response) {
            switch (response.status) {
                case 403:
                    return 'Please, re-login';
                default:
                    return 'Unknown error occurred';
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

'use strict';

angular.module('app')
    .factory('rgiUserMethodSrvc', function (
        $q,
        rgiHttpResponseProcessorSrvc,
        rgiUserSrvc
    ) {
        var
            getFormattedErrorMessage = function(errorMessage) {
                errorMessage = errorMessage.replace('ValidationError: ', '');
                return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
            },
            manipulateUser = function(user, action, formatErrorMessage) {
                var dfd = $q.defer();

                user[action]().then(function (response) {
                    if(response.data.reason) {
                        var errorMessage = response.data.reason;
                        dfd.reject(formatErrorMessage ? getFormattedErrorMessage(errorMessage) : errorMessage);
                    } else {
                        dfd.resolve();
                    }
                }, function (response) {
                    dfd.reject(rgiHttpResponseProcessorSrvc.getMessage(response));
                    rgiHttpResponseProcessorSrvc.handle(response);
                });

                return dfd.promise;
            };

        return {
            createUser: function (user) {
                return manipulateUser(new rgiUserSrvc(user), '$save', true);
            },
            deleteUser: function (userId) {
                var user = new rgiUserSrvc();
                user.id = userId;
                return manipulateUser(user, '$delete', false);
            },
            updateUser: function (user) {
                return manipulateUser(user, '$update', true);
            }
        };
    });

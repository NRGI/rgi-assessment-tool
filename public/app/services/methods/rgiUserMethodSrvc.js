'use strict';

angular.module('app')
    .factory('rgiUserMethodSrvc', function (
        $q,
        rgiUserSrvc
    ) {
        var
            getFormattedErrorMessage = function(errorMessage) {
                errorMessage = errorMessage.replace('ValidationError: ', '');
                return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
            },
            manipulateUser = function(user, action, formatErrorMessage) {
                var dfd = $q.defer();

                user[action]().then(function () {
                    dfd.resolve();
                }, function (response) {
                    var errorMessage = response.data.reason;
                    dfd.reject(formatErrorMessage ? getFormattedErrorMessage(errorMessage) : errorMessage);
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

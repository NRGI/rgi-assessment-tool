'use strict';

<<<<<<< HEAD
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

                user[action]().then(function (data) {
                    if(data.reason) {
                        var errorMessage = data.reason;
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
=======
angular.module('app').factory('rgiUserMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
    return {
        createUser: function (new_user_data) {
            var new_user = new rgiUserSrvc(new_user_data),
                dfd = $q.defer();

            new_user.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteUser: function (user_deletion) {
            var dfd = $q.defer(),
                deleteID = new rgiUserSrvc();

            deleteID.id = user_deletion;

            deleteID.$delete().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        updateUser: function (new_user_data) {
            var dfd = $q.defer();
            new_user_data.$update().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        }
    }
});
>>>>>>> a36829db08c82844e4c05cf309557594404f579b

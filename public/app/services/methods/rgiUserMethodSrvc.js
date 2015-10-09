angular
    .module('app')
    .factory('rgiUserMethodSrvc', function (
        $http,
        $q,
        rgiIdentitySrvc,
        rgiUserSrvc
    ) {
        'use strict';
        return {
            createUser: function (newUserData) {
                var newUser = new rgiUserSrvc(newUserData),
                    dfd = $q.defer(),
                    error_message;

                newUser.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    error_message = response.data.reason.replace('ValidationError: ', '');
                    dfd.reject(error_message.charAt(0).toUpperCase() + error_message.slice(1));
                });
                return dfd.promise;
            },
            deleteUser: function (userDeletion) {
                var dfd = $q.defer(),
                    deleteID = new rgiUserSrvc();

                deleteID.id = userDeletion;

                deleteID.$delete().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            updateUser: function (newUserData) {
                var dfd = $q.defer(),
                error_message;

                newUserData.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    error_message = response.data.reason.replace('ValidationError: ', '');
                    dfd.reject(error_message.charAt(0).toUpperCase() + error_message.slice(1));
                });
                return dfd.promise;
            }
        };
    });
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
            createUser: function (new_user_data) {
                var new_user = new rgiUserSrvc(new_user_data),
                    dfd = $q.defer(),
                    error_message;

                new_user.$save().then(function () {
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
            updateUser: function (new_user_data) {
                var dfd = $q.defer(),
                error_message;
                console.log(new_user_data);

                new_user_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    error_message = response.data.reason.replace('ValidationError: ', '');
                    dfd.reject(error_message.charAt(0).toUpperCase() + error_message.slice(1));
                });
                return dfd.promise;
            }
        };
    });
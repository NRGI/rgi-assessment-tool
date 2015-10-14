'use strict';
//var angular;
/*jslint nomen: true newcap: true */

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

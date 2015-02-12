angular.module('app').factory('rgiUserMethodSrvc', function ($http, $q, rgiIdentitySrvc, rgiUserSrvc) {
    return {
        createUser: function (newUserData) {
            var dfd = $q.defer();
            var newUser = new rgiUserSrvc(newUserData);

            newUser.$save().then(function () {
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        deleteUser: function (userDeletion) {
            var dfd = $q.defer();
            var deleteID = new rgiUserSrvc();
            deleteID.id = userDeletion;

            deleteID.$delete().then(function () {
                dfd.resolve();
            }), function (response) {
                dfd.reject(response.data.reason);
            };
            return dfd.promise;
        },
        updateUser: function (newUserData) {
            var dfd = $q.defer();
            newUserData.$update().then(function () {
                dfd.resolve();
            }), function (response) {
                dfd.reject(response.data.reason);
            };
            return dfd.promise;
        }
    }	
});
'use strict';
//var angular;

angular.module('app').factory('rgiContactMethodSrvc', function ($q, rgiContactSrvc) {
    return {
        contact: function (contactInfo) {
            var newContact = new rgiContactSrvc(contactInfo),
                dfd = $q.defer();

            newContact.$save().then(function () {
                dfd.resolve();
            }, function (res) {
                dfd.reject(res.data.reason);
            });

            return dfd.promise;
        }
    };
});

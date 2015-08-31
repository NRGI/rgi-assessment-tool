'use strict';
//var angular;

angular.module('app').factory('rgiContactMethodSrvc', function ($q, rgiContactTechSrvc) {
    return {
        contact: function (contactInfo) {
            var newContact = new rgiContactTechSrvc(contactInfo),
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

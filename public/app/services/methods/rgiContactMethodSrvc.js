'use strict';

angular.module('app')
    .factory('rgiContactMethodSrvc', function (
        $q,
        rgiContactTechSrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        return {
            contact: function (contactInfo) {
                var newContact = new rgiContactTechSrvc(contactInfo),
                    dfd = $q.defer();

                newContact.$save().then(dfd.resolve, rgiHttpResponseProcessorSrvc.getDeferredHandler(dfd));
                return dfd.promise;
            }
        };
    });

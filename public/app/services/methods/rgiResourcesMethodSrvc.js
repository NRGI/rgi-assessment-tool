'use strict';

angular
    .module('app')
    .factory('rgiResourcesMethodSrvc', function (
        $q,
        rgiResourcesSrvc
        //$http,
        //
    ) {
        return {
            createResource: function (new_resource_data) {
                var new_resource = new rgiResourcesSrvc(new_resource_data),
                    dfd = $q.defer();
                console.log(new_resource);
                new_resource.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            updateResource: function (new_resource_data) {
                var dfd = $q.defer();

                //noinspection CommaExpressionJS
                new_resource_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            deleteResource: function (resource_deletion) {
                var dfd = $q.defer(),
                    delete_ID = new rgiResourcesSrvc();

                delete_ID.id = resource_deletion;

                delete_ID.$delete().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            }
        };
    });
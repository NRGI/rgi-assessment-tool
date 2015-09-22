'use strict';

angular
    .module('app')
    .factory('rgiIntervieweeMethodSrvc', function (
        $http,
        $q,
        rgiIntervieweeSrvc
    ) {
        return {
            createInterviewee: function (new_interviewee_data) {
                var new_interviewee = new rgiIntervieweeSrvc(new_interviewee_data),
                    dfd = $q.defer();
                new_interviewee.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            deleteInterviewee: function (user_deletion) {
                var dfd = $q.defer(),
                    delete_ID = new rgiIntervieweeSrvc();

                delete_ID.id = user_deletion;

                //noinspection CommaExpressionJS
                delete_ID.$delete().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            },
            updateInterviewee: function (new_interviewee_data) {
                var dfd = $q.defer();

                //noinspection CommaExpressionJS
                new_interviewee_data.$update().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;
            }
        };
    });
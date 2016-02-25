'use strict';

angular.module('app')
    .factory('rgiAssessmentMethodSrvc', function (
        $http,
        $q,
        rgiIdentitySrvc,
        rgiAssessmentSrvc
    ) {
        return {
            createAssessment: function (new_assessment_data) {

                var dfd = $q.defer(),
                    new_assessments = new rgiAssessmentSrvc(new_assessment_data);

                new_assessments.length = new_assessment_data.length;
                new_assessments.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;

            },
            //deleteAssessment: function (userDeletion) {
            //    var dfd = $q.defer();
            //
            ////     userDeletion.$remove().then(function() {
            ////         dfd.resolve();
            ////     }), function(response) {
            ////         dfd.reject(response.data.reason);
            ////     };
            //    return dfd.promise;
            //},
            updateAssessment: function (new_assessment_data) {
                var dfd = $q.defer();

                new_assessment_data.$update().then(function () {
                    dfd.resolve();
                }, function(response) {
                    dfd.reject(response.data.reason);
                });

                return dfd.promise;
            }
        };
    });
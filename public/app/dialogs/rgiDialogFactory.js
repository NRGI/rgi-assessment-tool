angular
    .module('app')
    .factory('rgiDialogFactory', function (
        $scope
    ) {
        'use strict';
        return {
            assignAssessment: function ($scope) {

                var dfd = $q.defer(),
                    new_assessments = new rgiAssessmentSrvc(new_assessment_data);

                new_assessments.length = new_assessment_data.length;
                new_assessments.$save().then(function () {
                    dfd.resolve();
                }, function (response) {
                    dfd.reject(response.data.reason);
                });
                return dfd.promise;

            }
        };
    });
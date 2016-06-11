'use strict';

angular.module('app')
    .controller('rgiAssessmentStatusDialogCtrl', function (
        $scope,
        rgiNotifier,
        rgiAssessmentMethodSrvc
    ) {
        var
            setStatus = function(assessment, status) {
                assessment.status = status;
                $scope.statuses[$scope.assessmentId] = status;

                if((status.indexOf('reviewer') === 0) && (assessment.reviewer_ID !== undefined)) {
                    assessment.edit_control = assessment.reviewer_ID;
                }
            },
            getAssessment = function() {
                var foundAssessment = {};

                $scope.assessments.forEach(function(assessment) {
                    if(assessment._id === $scope.assessmentId) {
                        foundAssessment = assessment;
                    }
                });

                return foundAssessment;
            };

        $scope.setStatus = function () {
            var assessment = getAssessment(),
                originalStatus = assessment.status;

            setStatus(assessment, $scope.newStatus);

            rgiAssessmentMethodSrvc.updateAssessment(assessment)
                .then(function () {
                    rgiNotifier.notify('Status changed!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                    setStatus(assessment, originalStatus);
                }).finally($scope.closeThisDialog);
        };
    });

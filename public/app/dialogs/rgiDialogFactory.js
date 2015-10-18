'use strict';

angular
    .module('app')
    .factory('rgiDialogFactory', function (
        ngDialog
    ) {
        return {
            assignAssessment: function ($scope, assessment) {
                var scope = $scope;
                scope.value = true;
                scope.assessment_update_ID = assessment.assessment_ID;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-assessment-dialog',
                    controller: 'rgiAssignAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            //reassignAssessment: function ($scope, assessment) {
            //    var scope = $scope;
            //    scope.value = true;
            //    scope.assessment_update_ID = assessment.assessment_ID;
            //    ngDialog.open({
            //        template: 'partials/dialogs/assessments/assign-assessment-dialog',
            //        controller: 'rgiAssignAssessmentDialogCtrl',
            //        className: 'ngdialog-theme-default',
            //        scope: scope
            //    });
            //},
            newAssessment: function ($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/new-assessment-dialog',
                    controller: 'rgiNewAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            }
        };
    });
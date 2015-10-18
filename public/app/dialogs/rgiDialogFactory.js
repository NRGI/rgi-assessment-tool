'use strict';

angular
    .module('app')
    .factory('rgiDialogFactory', function (
        ngDialog
    ) {
        return {
            assignAssessment: function ($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-assessment-dialog',
                    controller: 'rgiAssignAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
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


//$scope.assessmentStartReview = function (assessment_ID) {
//    rgiAssessmentSrvc.get({assessment_ID: assessment_ID}, function (new_assessment_data) {
//        new_assessment_data.status = 'under_review';
//        rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
//            $location.path('/admin/assessments-admin/answer/' + assessment_ID + '-001');
//            rgiNotifier.notify('Assessment review started!');
//        }, function (reason) {
//            rgiNotifier.error(reason);
//        });
//    });
//};
//$scope.assignAssessmentDialog = function (assessment) {
//    $scope.value = true;
//    $scope.assessment_update_ID = assessment.assessment_ID;
//    ngDialog.open({
//        template: 'partials/dialogs/assign-assessment-dialog',
//        controller: 'rgiAssignAssessmentDialogCtrl',
//        className: 'ngdialog-theme-default dialogwidth800',
//        scope: $scope
//    });
//};
////TODO fix rgiAssignAssessmentDialogCtrl to reassign
//$scope.reassignAssessmentDialog = function (assessment) {
//    $scope.value = true;
//    $scope.assessment_update_ID = assessment.assessment_ID;
//    ngDialog.open({
//        template: 'partials/dialogs/assign-assessment-dialog',
//        controller: 'rgiAssignAssessmentDialogCtrl',
//        className: 'ngdialog-theme-default dialogwidth800',
//        scope: $scope
//    });
//};
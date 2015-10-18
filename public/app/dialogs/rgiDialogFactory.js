'use strict';

angular
    .module('app')
    .factory('rgiDialogFactory', function (
        ngDialog,
        rgiNotifier
    ) {
        return {
            assessmentAssign: function ($scope, assessment) {
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
            assessmentReassign: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length !== (scope.assessment_counters.flagged + scope.assessment_counters.approved)) {
                    rgiNotifier.error('You must approve or flag all questions!');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/move-assessment-dialog',
                        controller: 'rgiMoveAssessmentDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            },
            assessmentMove: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length !== (scope.assessment_counters.flagged + scope.assessment_counters.approved)) {
                    rgiNotifier.error('You must approve or flag all questions!');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/move-assessment-dialog',
                        controller: 'rgiMoveAssessmentDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            },
            assessmentNew: function ($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/new-assessment-dialog',
                    controller: 'rgiNewAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            assessmentSubmit: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length !== scope.assessment_counters.complete) {
                    rgiNotifier.error('You must complete all assessment questions');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/submit-confirmation-dialog',
                        controller: 'rgiSubmitConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            },
            assessmentResubmit: function ($scope) {
            //    var scope = $scope,
            //        flag_check = false;
            //    scope.answers.forEach(function (el) {
            //        if (el.status === 'flagged') {
            //            return flag_check = true;
            //        }
            //    });
            //    if (flag_check) {
            //        rgiNotifier.error('You must resubmit all flagged answers!');
            //    } else {
            //        scope.value = true;
            //        ngDialog.open({
            //            template: 'partials/dialogs/assessmentsresubmit-confirmation-dialog',
            //            controller: 'rgiResubmitConfirmationDialogCtrl',
            //            className: 'ngdialog-theme-default',
            //            scope: scope
            //        });
            //        //var new_assessment_data = scope.assessment;
            //        //new_assessment_data.status = 'resubmitted';
            //        //
            //        //rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
            //        //    .then(function () {
            //        //        $location.path('/assessments');
            //        //        rgiNotifier.notify('Assessment submitted!');
            //        //    }, function (reason) {
            //        //        rgiNotifier.error(reason);
            //        //    });
            //    }
            }
        };
    });
'use strict';

angular
    .module('app')
    .factory('rgiDialogFactory', function (
        ngDialog,
        rgiNotifier,
        rgiUtilsSrvc
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
                //var scope = $scope;
                //if (scope.assessment_counters.length !== (scope.assessment_counters.flagged + scope.assessment_counters.approved)) {
                //    rgiNotifier.error('You must approve or flag all questions!');
                //} else {
                //    scope.value = true;
                //    ngDialog.open({
                //        template: 'partials/dialogs/move-assessment-dialog',
                //        controller: 'rgiMoveAssessmentDialogCtrl',
                //        className: 'ngdialog-theme-default',
                //        scope: scope
                //    });
                //}
            },
            assessmentMove: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length !== (scope.assessment_counters.flagged + scope.assessment_counters.approved)) {
                    rgiNotifier.error('You must approve or flag all questions!');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/move-assessment-dialog',
                        controller: 'rgiMoveAssessmentDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            },
            assessmentMoveConfirm: function ($scope) {
                if (!$scope.action) {
                    rgiNotifier.error('You must select an action!');
                } else {
                    var scope = $scope.$parent;
                    scope.action = $scope.action;
                    ngDialog.close('ngdialog1');
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/move-assessment-confirmation-dialog',
                        controller: 'rgiMoveAssessmentConfirmationDialogCtrl',
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
                console.log(scope);
                if (scope.assessment_counters.length !== scope.assessment_counters.complete) {
                    rgiNotifier.error('You must complete all assessment questions');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/submit-confirmation-dialog',
                        controller: 'rgiSubmitAssessmentConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            },
            assessmentResubmit: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.flagged != 0) {
                    rgiNotifier.error('You must resubmit all flagged answers!');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/resubmit-confirmation-dialog',
                        controller: 'rgiResubmitAssessmentConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                    //var new_assessment_data = scope.assessment;
                    //new_assessment_data.status = 'resubmitted';
                    //
                    //rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    //    .then(function () {
                    //        $location.path('/assessments');
                    //        rgiNotifier.notify('Assessment submitted!');
                    //    }, function (reason) {
                    //        rgiNotifier.error(reason);
                    //    });
                }
            },
            commentEdit: function($scope, comment, index) {
                var scope = $scope;
                scope.value = true;
                scope.index = index;
                scope.comment = comment;
                ngDialog.open({
                    template: 'partials/dialogs/comments/comment-edit-dialog',
                    controller: 'rgiCommentEditDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            documentCreate: function($scope) {
                var scope = $scope;
                scope.value = true;

                ngDialog.close('ngdialog1');
                ngDialog.open({
                    template: 'partials/dialogs/references/new-document-dialog',
                    controller: 'rgiNewDocumentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            webpageCreate: function($scope) {
                var scope = $scope;
                scope.value = true;

                ngDialog.close('ngdialog1');
                ngDialog.open({
                    template: 'partials/dialogs/references/new-webpage-dialog',
                    controller: 'rgiNewWebpageDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            documentEdit: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/documents/edit-document-dialog',
                    controller: 'rgiEditDocumentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },

        //        if (scope.ref_selection === 'document') {

        //} else if (scope.ref_selection === 'webpage') {
        //    ngDialog.close('ngdialog1');
        //    ngDialog.open({
        //        template: 'partials/dialogs/new-webpage-dialog',
        //        controller: 'rgiNewWebpageDialogCtrl',
        //        className: 'ngdialog-theme-default',
        //        scope: scope
        //    });
        //}
            flagCreate: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/flags/flag-answer-dialog',
                    controller: 'rgiFlagAnswerDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });
            },
            flagEdit: function($scope, flag, index) {
                var scope = $scope;
                scope.value = true;
                scope.index = index;
                scope.flag = flag;
                ngDialog.open({
                    template: 'partials/dialogs/flags/flag-answer-dialog',
                    controller: 'rgiFlagEditDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            intervieweeEdit: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/interviewees/edit-interviewee-dialog',
                    controller: 'rgiEditIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            questionNew: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/questions/new-question-dialog',
                    controller: 'rgiNewQuestionDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            questionDelete: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/questions/delete-question-confirmation-dialog',
                    controller: 'rgiDeleteQuestionDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            referenceSelect: function ($scope, value) {
                var template = 'partials/dialogs/references/new-ref-' + value + '-dialog',
                    className = 'ngdialog-theme-default dialogwidth800',
                    scope = $scope;
                scope.value = true;
                scope.ref_selection = value;
                ngDialog.open({
                    template: template,
                    controller: 'rgiNewRefDialogCtrl',
                    className: className,
                    scope: $scope
                });
            },
            userEdit: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/users/edit-user-dialog',
                    controller: 'rgiEditUserDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            userDelete: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/users/delete-user-confirmation-dialog',
                    controller: 'rgiDeleteUserDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            }
        };
    });
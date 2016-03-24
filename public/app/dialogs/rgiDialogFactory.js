'use strict';

angular.module('app')
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
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            assessmentExternalAssign: function ($scope, assessment) {
                var scope = $scope;
                scope.value = true;
                scope.assessment_update_ID = assessment.assessment_ID;
                scope.userType = 'ext_reviewer';

                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-assessment-external-dialog',
                    controller: 'rgiAssignAssessmentMultipleAssigneeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            assessmentSupervisorAssign: function ($scope, assessment) {
                var scope = $scope;
                scope.value = true;
                scope.assessment_update_ID = assessment.assessment_ID;
                scope.userType = 'supervisor';

                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-assessment-supervisor-dialog',
                    controller: 'rgiAssignAssessmentMultipleAssigneeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            assessmentAddReviewer: function ($scope) {
                var scope = $scope;
                scope.value = true;
                //scope.assessment_update_ID = assessment.assessment_ID;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-external-to-assessment-dialog',
                    controller: 'rgiAssignExternalToAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            guidanceDialog: function ($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/answers/guidance-dialog',
                    controller: 'rgiGuidanceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });
            },
            assessmentMove: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length!==((scope.assessment_counters.flagged + scope.assessment_counters.approved + scope.assessment_counters.unresolved) || scope.assessment_counters.finalized)) {
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
            assessmentTrialSubmit: function ($scope) {
                var scope = $scope;
                if (scope.assessment_counters.length !== scope.assessment_counters.complete) {
                    rgiNotifier.error('You must complete all assessment trial questions');
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
            assessmentSubmit: function ($scope) {
                var scope = $scope;
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
                if (scope.assessment_counters.flagged !== 0) {
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
            answerFinalChoice: function ($scope) {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });

            },
            answerExternalChoice: function ($scope) {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });

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
            deleteInterviewee: function($scope, interviewee) {
                $scope.interviewee = interviewee;
                ngDialog.open({
                    template: 'partials/dialogs/interviewees/delete-interviewee-dialog',
                    controller: 'rgiDeleteIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            },
            referenceSelect: function ($scope, value){
                var scope = $scope;
                scope.value = true;
                scope.ref_selection = value;
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/new-ref-dialog',
                    controller: 'rgiNewRefDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            editDocumentReference: function ($scope, referenceIndex) {
                $scope.ref_index = referenceIndex;

                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/edit-document-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });
            },
            editInterviewReference: function ($scope, referenceIndex) {
                $scope.ref_index = referenceIndex;

                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/edit-interview-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });
            },
            referenceDeleteConfirmation: function ($scope, ref_index){
                var scope = $scope;
                scope.ref_index = ref_index;
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/delete-reference-dialog',
                    controller: 'rgiDeleteReferenceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: scope
                });
            },
            documentCreate: function($scope) {
                var scope = $scope;
                scope.value = true;

                ngDialog.close('ngdialog1');
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/new-document-dialog',
                    controller: 'rgiNewDocumentDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            webpageCreate: function($scope) {
                var scope = $scope;
                scope.value = true;

                ngDialog.close('ngdialog1');
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/new-webpage-dialog',
                    controller: 'rgiNewWebpageDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            documentEdit: function($scope) {
                var scope = $scope;
                scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/references/edit-document-dialog',
                    controller: 'rgiEditDocumentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: scope
                });
            },
            resourcenNew: function($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/resources/new-resource-dialog',
                    controller: 'rgiNewResourceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    scope: $scope
                });
            },
            resourceDelete: function($scope, resource) {
                var scope = $scope;
                scope.resource = resource;
                ngDialog.open({
                    template: 'partials/dialogs/resources/delete-resource-confirmation-dialog',
                    controller: 'rgiDeleteResourceDialogCtrl',
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
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/flags/flag-answer-dialog',
                    controller: 'rgiFlagAnswerDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    overlay: false,
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
                    template: 'partials/dialogs/references/edit-interviewee-dialog',
                    controller: 'rgiEditIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
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
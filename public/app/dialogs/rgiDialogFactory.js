'use strict';

angular.module('app')
    .factory('rgiDialogFactory', ['ngDialog', 'rgiNotifier', function (
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            assessmentViewerAssign: function ($scope, assessment) {
                $scope.assessment_update_ID = assessment.assessment_ID;
                $scope.userType = 'viewer';

                ngDialog.open({
                    template: 'partials/dialogs/assessments/assign-assessment-viewer-dialog',
                    controller: 'rgiAssignAssessmentMultipleAssigneeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            guidanceDialog: function ($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/answers/guidance-dialog',
                    controller: 'rgiGuidanceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            assessmentMove: function ($scope) {
                var scope = $scope,
                    getCounter = function(counter) {
                        return scope.assessment_counters[counter] || 0;
                    };

                if((getCounter('flagged') === 0) && ((getCounter('approved') + getCounter('unresolved') + getCounter('finalized')) < scope.assessment_counters.length)) {
                    rgiNotifier.error('You must approve all questions or flag at least one!');
                } else {
                    scope.value = true;
                    ngDialog.open({
                        template: 'partials/dialogs/assessments/move-assessment-dialog',
                        controller: 'rgiMoveAssessmentDialogCtrl',
                        className: 'ngdialog-theme-default',
                        closeByNavigation: true,
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
                        closeByNavigation: true,
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
                    closeByNavigation: true,
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
                        closeByNavigation: true,
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
                        closeByNavigation: true,
                        scope: scope
                    });
                }
            },
            assessmentResubmit: function ($scope) {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/assessments/resubmit-confirmation-dialog',
                    controller: 'rgiResubmitAssessmentConfirmationDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            answerFinalChoice: function ($scope) {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });

            },
            answerExternalChoice: function ($scope) {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });

            },
            commentEdit: function(answer, comment) {
                ngDialog.open({
                    template: 'partials/dialogs/comments/edit-comment-dialog',
                    controller: 'rgiEditCommentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    data: {
                        answer: answer,
                        comment: comment
                    }
                });
            },
            deleteAssessment: function($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/assessments/delete-assessment-dialog',
                    controller: 'rgiDeleteAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            deleteComment: function($scope, comment) {
                $scope.comment = comment;
                ngDialog.open({
                    template: 'partials/dialogs/comments/delete-comment-dialog',
                    controller: 'rgiDeleteCommentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            deleteDocument: function($scope, doc) {
                $scope.document = doc;
                ngDialog.open({
                    template: 'partials/dialogs/documents/delete-document-dialog',
                    controller: 'rgiDeleteDocumentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            deleteInterviewee: function($scope, interviewee, redirectToIntervieweeList) {
                $scope.interviewee = interviewee;
                $scope.redirectToIntervieweeList = redirectToIntervieweeList;

                ngDialog.open({
                    template: 'partials/dialogs/interviewees/delete-interviewee-dialog',
                    controller: 'rgiDeleteIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            editAnswerJustification: function($scope, role) {
                $scope.field = role + '_justification';

                ngDialog.openConfirm({
                    template: 'partials/dialogs/answers/edit-answer-justification-dialog',
                    controller: 'rgiEditAnswerJustificationDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            editDocumentReference: function ($scope, referenceIndex) {
                $scope.ref_index = referenceIndex;

                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/edit-document-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            editInterviewReference: function ($scope, referenceIndex) {
                $scope.ref_index = referenceIndex;

                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/edit-interview-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            restoreReference: function ($scope, referenceIndex) {
                $scope.ref_index = referenceIndex;
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/restore-reference-dialog',
                    controller: 'rgiDeleteReferenceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            documentCreate: function($scope, fileUrl) {
                var scope = $scope;
                scope.value = true;
                scope.source = fileUrl;

                ngDialog.close('ngdialog1');
                ngDialog.openConfirm({
                    template: 'partials/dialogs/references/new-document-dialog',
                    controller: 'rgiNewDocumentDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            createResource: function($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/resources/new-resource-dialog',
                    controller: 'rgiNewResourceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            deleteResource: function($scope, resource) {
                var scope = $scope;
                scope.resource = resource;
                ngDialog.open({
                    template: 'partials/dialogs/resources/delete-resource-confirmation-dialog',
                    controller: 'rgiDeleteResourceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            setAssessmentStatus: function($scope, assessmentId, status) {
                $scope.assessmentId = assessmentId;
                $scope.newStatus = status;

                ngDialog.open({
                    template: 'partials/dialogs/assessments/assessment-status-dialog',
                    controller: 'rgiAssessmentStatusDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: $scope
                });
            },
            unlinkDocument: function($scope, doc) {
                $scope.document = doc;

                ngDialog.open({
                    template: 'partials/dialogs/documents/unlink-document-dialog',
                    controller: 'rgiUnlinkDocumentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
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
                    closeByNavigation: true,
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
                    closeByNavigation: true,
                    scope: scope
                });
            },
            toggleUserDisabledStatus: function($scope) {
                ngDialog.open({
                    template: 'partials/dialogs/users/toggle-user-disabled-status-dialog',
                    controller: 'rgiToggleUserDisabledStatusDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: $scope
                });
            }
        };
    }]);
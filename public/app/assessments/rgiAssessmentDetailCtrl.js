angular
    .module('app')
    .controller('rgiAssessmentDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiUserListSrvc,
        rgiAnswerSrvc,
        rgiDialogFactory,
        rgiAssessmentMethodSrvc
    ) {
        'use strict';
        // filtering options
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}];
        $scope.sortOrder = $scope.sortOptions[0].value;

        $scope.current_user = rgiIdentitySrvc.currentUser;

        rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
            $scope.assessment = assessment;
            $scope.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
            if (assessment.reviewer_ID) {
                $scope.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
            }
            $scope.assigned_by = rgiUserListSrvc.get({_id: assessment.assignment.assigned_by});
            $scope.edited_by = rgiUserListSrvc.get({_id: assessment.last_modified.modified_by});
            $scope.answers = [];
            rgiAnswerSrvc.query({assessment_ID: assessment.assessment_ID}, function (answers) {
                $scope.assessment_counters = {
                    length: answers.length,
                    complete: 0,
                    flagged: 0,
                    submitted: 0,
                    approved: 0,
                    resubmitted: 0,
                    assigned: 0,
                    saved: 0,
                    unresolved: 0,
                    finalized: 0
                };
                answers.forEach(function (el) {
                    switch (el.status) {
                        case 'flagged':
                            $scope.assessment_counters.flagged +=1;
                            $scope.assessment_counters.complete +=1;
                            break;
                        case 'submitted':
                            $scope.assessment_counters.submitted +=1;
                            $scope.assessment_counters.complete +=1;
                            break;
                        case 'approved':
                            $scope.assessment_counters.approved +=1;
                            $scope.assessment_counters.complete +=1;
                            break;
                        case 'unresolved':
                            $scope.assessment_counters.unresolved +=1;
                            if ($scope.assessment.status === 'under_review') {
                                $scope.assessment_counters.complete +=1;
                            }
                        case 'finalized':
                            $scope.assessment_counters.saved +=1;
                            $scope.assessment_counters.complete +=1;
                            break;
                        case 'resubmitted':
                            $scope.assessment_counters.resubmitted +=1;
                            break;
                        case 'assigned':
                            $scope.assessment_counters.assigned +=1;
                            break;
                        case 'saved':
                            $scope.assessment_counters.saved +=1;
                            break;
                    }
                });
                $scope.answers = answers;

            });
        });
        $scope.submitAssessmentDialog = function () {
            rgiDialogFactory.assessmentSubmit($scope);
        };
        $scope.resubmitAssessmentDialog = function () {
            rgiDialogFactory.assessmentResubmit($scope);
        };
        $scope.moveAssessmentDialog = function () {
            rgiDialogFactory.assessmentMove($scope);
        };
    });

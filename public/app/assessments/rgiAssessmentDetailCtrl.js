'use strict';

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
        rgiQuestionSrvc
    ) {
        // filtering options
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}];
        $scope.sortOrder = $scope.sortOptions[0].value;
        $scope.order_reverse = true;

        $scope.current_user = rgiIdentitySrvc.currentUser;



        rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment) {
            var answer_query = {assessment_ID: assessment.assessment_ID};
            if (['trial', 'trial_started', 'trial_submitted'].indexOf(assessment.status) > -1) {
                answer_query.question_trial = true;
            }
            $scope.assessment = assessment;
            $scope.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
            if (assessment.reviewer_ID) {
                $scope.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
            }
            $scope.assigned_by = rgiUserListSrvc.get({_id: assessment.assignment.assigned_by});
            $scope.edited_by = rgiUserListSrvc.get({_id: assessment.last_modified.modified_by});
            $scope.answers = [];
            rgiAnswerSrvc.query(answer_query, function (answers) {
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

                $scope.answers = {
                    precept_1: {
                        label: "Precept 1: Strategy, consultation and institutions",
                        id: "precept_1",
                        order: 1,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_2: {
                        label: "Precept 2: Accountability and transparency",
                        id: "precept_2",
                        order: 2,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_3: {
                        label: "Precept 3: Exploration and license allocation",
                        id: "precept_3",
                        order: 3,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_4: {
                        label: "Precept 4: Taxation",
                        id: "precept_4",
                        order: 4,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_5: {
                        label: "Precept 5: Local effects",
                        id: "precept_5",
                        order: 5,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_6: {
                        label: "Precept 6: State-owned enterprise",
                        id: "precept_6",
                        order: 6,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_7: {
                        label: "Precept 7: Revenue distribution",
                        id: "precept_7",
                        order: 7,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_8: {
                        label: "Precept 8: Revenue volatility",
                        id: "precept_8",
                        order: 8,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_9: {
                        label: "Precept 9: Government spending",
                        id: "precept_9",
                        order: 9,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_10: {
                        label: "Precept 10: Private sector development",
                        id: "precept_10",
                        order: 10,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_11: {
                        label: "Precept 11: Roles of international companies",
                        id: "precept_11",
                        order: 11,
                        section_len: 0,
                        complete: 0,
                        data: []
                    },
                    precept_12: {
                        label: "Precept 12: Roles of international actors",
                        id: "precept_12",
                        order: 12,
                        section_len: 0,
                        complete: 0,
                        data: []
                    }
                };

                answers.forEach(function (answer) {
                    switch (answer.status) {
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
                            if (['under_review', 'resubmitted'].indexOf($scope.assessment.status) > -1) {
                                $scope.assessment_counters.complete +=1;
                            }
                            break;
                        case 'final':
                            $scope.assessment_counters.finalized +=1;
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
                    $scope.answers["precept_" + String(answer.question_ID.precept)].section_len += 1;
                    if (answer.status === 'submitted' || answer.status === 'resubmitted') {
                        $scope.answers["precept_" + String(answer.question_ID.precept)].complete += 1;
                    }
                    $scope.answers["precept_" + String(answer.question_ID.precept)].data.push(answer);
                });
            });
        });
        $scope.submitTrialAssessmentDialog = function () {
            rgiDialogFactory.assessmentTrialSubmit($scope);
        };
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

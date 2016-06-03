'use strict';

angular.module('app')
    .controller('rgiAssessmentsListCtrl', function (
        $scope,
        $rootScope,
        $routeParams,
        rgiAnswerSrvc,
        rgiAssessmentSrvc,
        rgiAssessmentStatisticsGuideSrvc,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        // filtering options
        $scope.sort_options = [
            {value: 'country', text: 'Sort by Country'},
            {value: 'start_date', text: 'Sort by Date started'},
            {value: 'status', text: 'Sort by Status'}
        ];
        $scope.sort_order = $scope.sort_options[0].value;

        $scope.statuses = {};
        $scope.availableStatuses = [
            'unassigned',
            'assigned',
            'assigned_researcher',
            'assigned_reviewer',
            'trial',
            'trial_started',
            'researcher_trial',
            'reviewer_trial',
            'trial_continue',
            'trial_submitted',
            'researcher_started',
            'reviewer_started',
            'submitted',
            'resubmitted',
            'under_review',
            //'started',
            //'review',
            //'reassigned',
            'approved'
        ];
        $scope.availableStatuses.sort();

        var getAssessments = function(criteria) {
            rgiAssessmentSrvc.query(criteria, function (assessments) {
                $scope.assessments = [];
                $scope.statuses = {};
                rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

                assessments.forEach(function (assessment) {
                    $scope.assessments.push(assessment);
                    $scope.statuses[assessment._id] = assessment.status;

                    if($scope.current_user.isExternalReviewer()) {
                        var assessmentId = assessment.assessment_ID;
                        var answerCriteria = {assessment_ID: assessmentId};

                        if (['trial', 'trial_started', 'trial_submitted'].indexOf(assessment.status) > -1) {
                            answerCriteria.question_trial = true;
                        }

                        rgiAnswerSrvc.query(answerCriteria, function (answers) {
                            rgiAssessmentStatisticsGuideSrvc.getCounterSetTemplate(function(counters) {
                                $scope.assessmentsStatistics[assessmentId] = counters;
                                answers.forEach(function (answer) {
                                    rgiAssessmentStatisticsGuideSrvc.updateCounters(answer, $scope.assessmentsStatistics[assessmentId], assessment);
                                });
                            });
                        }, rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load answer data failure'));
                    }
                });
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));
        };

        var criteria = {};
        $scope.assessmentsStatistics = {};

        if ($scope.current_user.isSupervisor()) {
            $scope.sort_options.push({value: 'year', text: 'Sort by Year of assessment'});
            $scope.sort_options.push({value: 'version', text: 'Sort by Version'});

            if ($routeParams.version) {
                criteria = {
                    year: $routeParams.version.substr(0, 4),
                    version: $routeParams.version.substr(5)
                };
            }
        } else {
            criteria[$scope.current_user.role + '_ID'] = $scope.current_user._id;
        }

        getAssessments(criteria);
        $rootScope.$on('REFRESH_ASSESSMENT_LIST', function() {
            getAssessments(criteria);
        });

        $scope.newAssessmentDialog = function () {
            $scope.year = criteria.year;
            $scope.version = criteria.version;
            rgiDialogFactory.assessmentNew($scope);
        };

        $scope.setAssessmentStatus = function(assessmentId, status) {
            rgiDialogFactory.setAssessmentStatus($scope, assessmentId, status);
        };
    });

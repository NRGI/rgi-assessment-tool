angular
    .module('app')
    .controller('rgiAssessmentsListCtrl', function (
        $scope,
        $location,
        rgiNotifier,
        rgiAssessmentSrvc,
        rgiUserListSrvc,
        rgiIdentitySrvc,
        rgiAssessmentMethodSrvc
    ) {
        'use strict';

        // filtering options
        $scope.sort_options = [
            {value: 'country', text: 'Sort by Country'},
            {value: 'start_date', text: 'Date started'},
            {value: 'status', text: 'Status'}];
        $scope.sort_order = $scope.sort_options[0].value;

        $scope.current_user = rgiIdentitySrvc.currentUser;

        if ($scope.current_user.role === 'researcher') {
            rgiAssessmentSrvc.query({researcher_ID: $scope.current_user._id}, function (data) {
                // pull assessment list from collection and adds user name to match reviewer id and researcher id
                $scope.assessments = [];
                var i, assessment;
                for (i = data.length - 1; i >= 0; i -= 1) {
                    assessment = data[i];
                    assessment.edited_by = rgiUserListSrvc.get({_id: data[i].modified[data[i].modified.length - 1].modified_by});
                    if (assessment.reviewer_ID) {
                        assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                        assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                    } else {
                        assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                    }
                    $scope.assessments.push(assessment);
                }
            });
        } else if ($scope.current_user.role === 'reviewer') {
            rgiAssessmentSrvc.query({reviewer_ID: $scope.current_user._id}, function (data) {
                // pull assessment list from collection and adds user name to match reviewer id and researcher id
                $scope.assessments = [];
                var i, assessment;
                for (i = data.length - 1; i >= 0; i -= 1) {
                    assessment = data[i];
                    assessment.edited_by = rgiUserListSrvc.get({_id: data[i].modified[data[i].modified.length - 1].modified_by});
                    if (assessment.reviewer_ID) {
                        assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                        assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
                    }
                    $scope.assessments.push(assessment);
                }
            });
        }

        $scope.assessmentStart = function (assessment) {
            var new_assessment_data = assessment;

            new_assessment_data.status = 'started';
            new_assessment_data.start_date = {started_by: rgiIdentitySrvc.currentUser._id};

            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
                $location.path('/assessments/answer/' + new_assessment_data.assessment_ID + '-001');
                rgiNotifier.notify('Assessment started!');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.assessmentResubmit = function () {
            var new_assessment_data = new rgiAssessmentSrvc($scope.assessment);

            new_assessment_data.status = 'resubmitted';

            rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                .then(function () {
                    $location.path('/assessments');
                    rgiNotifier.notify('Assessment submitted!');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };
    });
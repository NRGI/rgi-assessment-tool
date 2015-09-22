angular
    .module('app')
    .controller('rgiIntervieweeAdminDetailCtrl', function (
        $scope,
        $route,
        $routeParams,
        ngDialog,
        rgiNotifier,
        rgiUserListSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiAssessmentSrvc
    ) {
        'use strict';
        rgiAssessmentSrvc.query({}, function (assessments) {
            rgiIntervieweeSrvc.get({_id: $routeParams.interviewee_ID}, function (interviewee) {
                $scope.interviewee = interviewee;
                $scope.user_list = [];
                $scope.assessments = [];
                assessments.forEach(function (el) {
                    if (interviewee.assessments.indexOf(el.assessment_ID) < 0) {
                        $scope.assessments.push({
                            assessment_ID: el.assessment_ID,
                            text: el.country + ' - ' + el.year
                        });
                    }
                });
                interviewee.users.forEach(function (el) {
                    rgiUserListSrvc.get({_id: el}, function (user) {
                        $scope.user_list.push(user);
                    });
                });
            });

        });

        $scope.editIntervieweeDialog = function () {
            $scope.value = true;
            ngDialog.open({
                template: 'partials/dialogs/edit-interviewee-dialog',
                controller: 'rgiEditIntervieweeDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.addAssessment = function () {
            if ($scope.add_assessment === undefined) {
                rgiNotifier.error('You must select an assessment from the dropdown!');
            } else {
                var new_interviewee_data = $scope.interviewee;
                if (new_interviewee_data.assessments.indexOf($scope.add_assessment) < 0) {
                    new_interviewee_data.assessments.push($scope.add_assessment);
                    rgiIntervieweeMethodSrvc.updateInterviewee(new_interviewee_data).then(function () {
                        rgiNotifier.notify('Interviewee updated');
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
                }
            }
        };
    });
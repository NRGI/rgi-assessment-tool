'use strict';
/*jslint nomen: true unparam: true regexp: true*/
angular.module('app')
    .controller('rgiIntervieweeAdminDetailCtrl', function (
        $scope,
        $http,
        $route,
        $routeParams,
        ngDialog,
        rgiNotifier,
        rgiUserListSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiAssessmentSrvc,
        rgiDialogFactory
    ) {
        $scope.references = [];

        rgiAssessmentSrvc.query({}, function (assessments) {
            rgiIntervieweeSrvc.get({_id: $routeParams.interviewee_ID}, function (interviewee) {
                $scope.interviewee = interviewee;
                $scope.user_list = [];
                $scope.assessments = [];

                $http.get('/api/interviewee-answers/' + $scope.interviewee.answers).then(function(response) {
                    response.data.forEach(function(answer) {
                        answer.references.forEach(function(ref) {
                            if((ref.citation_type === 'interview') && (ref.interviewee_ID === interviewee._id)) {
                                $scope.references.push(ref);
                            }
                        });
                    });
                });

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
            rgiDialogFactory.intervieweeEdit($scope);
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
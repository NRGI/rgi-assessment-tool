'use strict';

angular.module('app')
    .controller('rgiIntervieweeAdminDetailCtrl', ['$scope', '$route', '$routeParams', 'ngDialog', 'rgiIdentitySrvc', 'rgiNotifier', 'rgiUserSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiIntervieweeSrvc', 'rgiIntervieweeAnswerSrvc', 'rgiIntervieweeMethodSrvc', 'rgiAssessmentSrvc', 'rgiDialogFactory', function (
        $scope,
        $route,
        $routeParams,
        ngDialog,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiUserSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeAnswerSrvc,
        rgiIntervieweeMethodSrvc,
        rgiAssessmentSrvc,
        rgiDialogFactory
    ) {
        $scope.references = [];
        $scope.current_user = rgiIdentitySrvc.currentUser;

        rgiAssessmentSrvc.query({}, function (assessments) {
            rgiIntervieweeSrvc.get({_id: $routeParams.interviewee_ID}, function (interviewee) {
                $scope.interviewee = interviewee;
                $scope.user_list = [];
                $scope.users = [];
                $scope.assessments = [];
                rgiUserSrvc.query({}, function(users) {
                    users.forEach(function(user) {
                        if (interviewee.users.indexOf(user._id) < 0) {
                            $scope.users.push({
                                _id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role
                            });
                        }
                    });
                }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load user data failure'));

                if($scope.interviewee.answers.length > 0) {
                    rgiIntervieweeAnswerSrvc.query({answers: $scope.interviewee.answers}, function(answers) {
                        answers.forEach(function(answer) {
                            answer.references.forEach(function(ref) {
                                if((ref.citation_type === 'interview') && (ref.interviewee_ID === interviewee._id)) {
                                    ref.interviewee_ID = interviewee;
                                    $scope.references.push(ref);
                                }
                            });
                        });
                    }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee answers failure'));
                }

                assessments.forEach(function (el) {
                    if (interviewee.assessments.indexOf(el.assessment_ID) < 0) {
                        $scope.assessments.push({
                            assessment_ID: el.assessment_ID,
                            text: el.country + ' - ' + el.year
                        });
                    }
                });
                rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

                interviewee.users.forEach(function (el) {
                    rgiUserSrvc.getCached({_id: el}, function(linkedUser) {$scope.user_list.push(linkedUser);},
                        rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load user list failure'));
                });

            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee data failure'));
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));

        $scope.editIntervieweeDialog = function () {
            rgiDialogFactory.intervieweeEdit($scope);
        };

        $scope.deleteInterviewee = function() {
            rgiDialogFactory.deleteInterviewee($scope, $scope.interviewee, true);
        };

        // $scope.addAssessment = function () {
        //     if ($scope.add_assessment === undefined) {
        //         rgiNotifier.error('You must select an assessment from the dropdown!');
        //     } else {
        //         var new_interviewee_data = $scope.interviewee;
        //         if (new_interviewee_data.assessments.indexOf($scope.add_assessment) < 0) {
        //             new_interviewee_data.assessments.push($scope.add_assessment);
        //             rgiIntervieweeMethodSrvc.updateInterviewee(new_interviewee_data).then(function () {
        //                 rgiNotifier.notify('Interviewee updated');
        //                 $route.reload();
        //             }, function (reason) {
        //                 rgiNotifier.notify(reason);
        //             });
        //         }
        //     }
        // };
        $scope.addUser = function () {
            if ($scope.add_user === undefined) {
                rgiNotifier.error('You must select an user from the dropdown!');
            } else {
                var new_interviewee_data = $scope.interviewee;
                if (new_interviewee_data.users.indexOf($scope.add_user) < 0) {
                    new_interviewee_data.users.push($scope.add_user);
                    rgiIntervieweeMethodSrvc.updateInterviewee(new_interviewee_data).then(function () {
                        rgiNotifier.notify('Interviewee updated');
                        $route.reload();
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
                }
            }
        };
    }]);

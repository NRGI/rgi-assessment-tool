'use strict';

angular
    .module('app')
    .controller('rgiActiveAnswerButtonsCtrl', function (
        $scope,
        $location,
        $routeParams,
        $route,
        ngDialog,
        rgiUtilsSrvc,
        rgiIdentitySrvc,
        rgiAnswerSrvc,
        rgiAnswerMethodSrvc,
        rgiNotifier,
        rgiDialogFactory
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        var root_url,
            assessment_ID = $routeParams.answer_ID.substring(0, $routeParams.answer_ID.length - 4);

        if ($scope.current_user.role === 'supervisor') {
            root_url = '/admin/assessments-admin';
        } else {
            root_url = '/assessments';
        }
        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            $scope.question_length = answers.length;
        });

        $scope.answerSave = function () {
            var new_answer_data = $scope.answer,
                flag_check = rgiUtilsSrvc.flagCheck(new_answer_data.flags);
            if (new_answer_data.new_answer_selection) {
                new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
            }

            if (new_answer_data.status!=='flagged' && flag_check) {
                new_answer_data.status = 'flagged';
            } else if (new_answer_data.status==='flagged' && !flag_check) {
                new_answer_data.status = 'saved';
            } else if (new_answer_data.status==='assigned') {
                new_answer_data.status = 'saved';
            }

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(function () {
                    rgiNotifier.notify('Answer saved');
                }, function (reason) {
                    rgiNotifier.notify(reason);
                });
        };

        $scope.answerSubmit = function () {
            var new_answer_data = $scope.answer;

            if (!new_answer_data[$scope.current_user.role + '_score'] && !new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else if (new_answer_data.references.length < 1) {
                rgiNotifier.error('You must provide at least one supporting reference!');
            } else {
                if (new_answer_data.status !== 'submitted') {
                    new_answer_data.status = 'submitted';
                }
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        if ((new_answer_data.question_order!==$scope.question_length) && ($scope.$parent.assessment.status!=='trial_started')) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer submitted');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };

        $scope.answerResubmit = function () {
            var new_answer_data = $scope.answer;

            if (!new_answer_data[$scope.current_user.role + '_score'] && new_answer_data.new_answer_selection) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else {
                new_answer_data.status = 'resubmitted';
                if (new_answer_data.new_answer_selection) {
                    new_answer_data[$scope.current_user.role + '_score'] = $scope.question.question_criteria[new_answer_data.new_answer_selection];
                }
                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        if (new_answer_data.question_order !== $scope.question_length) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer resubmitted');
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };

        $scope.answerApprove = function () {
            var new_answer_data = $scope.answer,
                flag_check = rgiUtilsSrvc.flagCheck(new_answer_data.flags);

            if (new_answer_data.status !== 'approved' && flag_check === true) {
                rgiNotifier.error('You can only approve an answer when all flags have been dealt with!');
            } else {
                new_answer_data.status = 'approved';
                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        if ((new_answer_data.question_order !== $scope.question_length) && ($scope.$parent.assessment.status!=='trial_submitted')) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer approved');
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };
        //TODO fix
        $scope.answerClear = function () {
            $route.reload();
            //$scope.answer = angular.copy($scope.$parent.answer_start);
        };

        $scope.answerReturn = function () {
            $location.path(root_url + '/' + $scope.answer.assessment_ID);
        };

        $scope.answerFlag = function () {
            rgiDialogFactory.flagCreate($scope);
        };

        $scope.answerUnresolved = function() {
            var new_answer_data = $scope.answer,
                flag_check = rgiUtilsSrvc.flagCheck(new_answer_data.flags);

            if (flag_check !== true) {
                rgiNotifier.error('Only mark flagged answers as unresolved!');
            } else {
                new_answer_data.status = 'unresolved';
                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        if (new_answer_data.question_order !== $scope.question_length) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer tagged as unresolved');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
        // make final choice
        $scope.finalChoiceDialog = function () {
            rgiDialogFactory.answerFinalChoice($scope);
        };
    });
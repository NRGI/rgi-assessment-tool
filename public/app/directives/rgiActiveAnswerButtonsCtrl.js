//  functions
function flagCheck(flags) {
    'use strict';
    var disabled = false;
    if (flags.length !== 0) {
        flags.forEach(function (el) {
            if (el.addressed === false) {
                disabled = true;
            }
        });
    }
    return disabled;
}
function zeroFill(number, width) {
    'use strict';
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}
angular
    .module('app')
    .controller('rgiActiveAnswerButtonsCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc,
        rgiAssessmentMethodSrvc,
        rgiNotifier
    ) {
        'use strict';
        var root_url;
        $scope.current_user = rgiIdentitySrvc.currentUser;

        if ($scope.current_user.role === 'supervisor') {
            root_url = '/admin/assessments-admin';
        } else {
            root_url = '/assessments';
        }
        $scope.answerSave = function () {
            var new_answer_data = $scope.answer,
                new_assessment_data = $scope.assessment,
                flag_check = flagCheck(new_answer_data.flags);

            //if (new_answer_data.status === 'assigned') {
            //    new_answer_data.status = 'saved';
            //}
            switch (new_answer_data.status) {
                case 'assigned':
                    new_answer_data.status = 'saved';
                    break;
                case 'saved':
                    if (flag_check === true) {
                        new_answer_data.status = 'flagged';
                        new_assessment_data.questions_flagged += 1;
                        new_assessment_data.questions_complete += 1;
                    }
                    break;
                case 'approved':
                    if (flag_check === true) {
                        new_answer_data.status = 'flagged';
                        new_assessment_data.questions_flagged += 1;
                        new_assessment_data.questions_approved -= 1;
                    }
                    break;
                case 'flagged':
                    if(flag_check === false) {
                        new_answer_data.status = 'saved';
                        new_assessment_data.questions_flagged -= 1;
                        new_assessment_data.questions_complete -= 1;
                    }
                    break;
                default:
                    console.log('unknown error');

            }

            //if (flag_check === true) {
            //    switch (new_answer_data) {
            //        //case 'saved':
            //        //    new_answer_data.status = 'flagged';
            //        //    new_assessment_data.questions_flagged += 1;
            //        //    new_assessment_data.questions_complete += 1;
            //        //    break;
            //    //    case 'approved':
            //    //        new_answer_data.status = 'flagged';
            //    //        new_assessment_data.questions_flagged += 1;
            //    //        new_assessment_data.questions_approved -= 1;
            //    //        break;
            //    //    case 'flagged':
            //    //        if()
            //    //        break;
            //    //
            //    //}
            //
            //    if (new_answer_data.status !== 'flagged') {
            //        new_answer_data.status = 'flagged';
            //        new_assessment_data.questions_flagged += 1;
            //        if (new_answer_data.status === 'approved') {
            //            new_assessment_data.questions_approved -= 1;
            //        }
            //        if(new_answer_data.status === 'saved') {
            //            new_assessment_data.questions_complete += 1;
            //        }
            //    }
            //} else {
            //    if (new_answer_data.status === 'flagged') {
            //        new_answer_data.status = 'saved';
            //        new_assessment_data.questions_flagged -= 1;
            //        new_assessment_data.questions_complete -= 1;
            //    }
            //}
            //switch (new_answer_data.status) {
            //    case 'assigned':
            //        new_answer_data.status = 'saved';
            //        break;
            //    case 'flagged':
            //        new_answer_data.status = 'approved';
            //        new_assessment_data.questions_approved += 1;
            //        new_assessment_data.questions_flagged -= 1;
            //        break;
            //    case 'saved':
            //        new_assessment_data.questions_approved += 1;
            //        new_answer_data.status = 'approved';
            //        break;
            //    //case 'resubmitted':
            //    //    new_answer_data.status = 'approved';
            //    //    new_assessment_data.questions_approved += 1;
            //    //    new_assessment_data.questions_flagged -= 1;
            //    //    break;
            //    default:
            //        console.log('unknown error');
            //}

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                .then(function () {
                    rgiNotifier.notify('Answer saved');
                }, function (reason) {
                    rgiNotifier.notify(reason);
                });
        };

        $scope.answerSubmit = function () {
            var new_answer_data = $scope.answer,
                new_assessment_data = $scope.assessment;

            if (!new_answer_data[$scope.current_user.role + '_score']) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else {
                if (new_answer_data.status !== 'submitted') {
                    new_answer_data.status = 'submitted';
                    new_assessment_data.questions_complete += 1;
                }

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(function () {
                        if (new_assessment_data.questions_complete !== new_assessment_data.question_length && new_answer_data.question_order !== new_assessment_data.question_length) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer submitted');
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });

            }
        };

        $scope.answerResubmit = function () {
            var new_answer_data = $scope.answer,
                new_assessment_data = $scope.assessment;

            if (!new_answer_data[$scope.current_user.role + '_score']) {
                rgiNotifier.error('You must pick a score');
            } else if (!new_answer_data[$scope.current_user.role + '_justification']) {
                rgiNotifier.error('You must provide a justification');
            } else {
                if (new_answer_data.status === 'flagged') {
                    new_answer_data.status = 'resubmitted';
                    new_assessment_data.questions_resubmitted += 1;
                }
                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(function () {
                        //$location.path('/assessments-review/' + new_answer_data.assessment_ID);
                        rgiNotifier.notify('Answer resubmitted');
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };

        $scope.answerApprove = function () {
            var new_answer_data = $scope.answer,
                new_assessment_data = $scope.assessment,
                flag_check = flagCheck(new_answer_data.flags);

            if (new_answer_data.status !== 'approved' && flag_check === true) {
                rgiNotifier.error('You can only approve an answer when all flags have been dealt with!');
            } else {
                switch (new_answer_data.status) {
                    case 'submitted':
                        new_answer_data.status = 'approved';
                        new_assessment_data.questions_approved += 1;
                        new_assessment_data.questions_complete += 1;
                        break;
                    case 'flagged':
                        new_answer_data.status = 'approved';
                        new_assessment_data.questions_approved += 1;
                        new_assessment_data.questions_flagged -= 1;
                        break;
                    case 'saved':
                        new_assessment_data.questions_approved += 1;
                        new_assessment_data.questions_complete += 1;
                        new_answer_data.status = 'approved';
                        break;
                    //case 'resubmitted':
                    //    new_answer_data.status = 'approved';
                    //    new_assessment_data.questions_approved += 1;
                    //    new_assessment_data.questions_flagged -= 1;
                    //    break;
                    default:
                        console.log('unknown error');
                }

                //if (new_answer_data.status === 'submitted') {
                //    new_answer_data.status = 'approved';
                //    new_assessment_data.questions_complete += 1;
                //    } else if (new_answer_data.status === 'flagged' || new_answer_data.status === 'resubmitted') {
                //} else if (new_answer_data.status === 'flagged') {
                //    new_answer_data.status = 'approved';
                //    new_assessment_data.questions_flagged -= 1;
                //} else if (new_answer_data.status === 'approved' && flag_check === true) {
                //    new_answer_data.status = 'flagged';
                //    new_assessment_data.questions_flagged += 1;
                //} else if (new_answer_data.status === 'resubmitted') {
                //    new_answer_data.status = 'approved';
                //    new_assessment_data.questions_flagged -= 1;
                //} else

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(function () {
                        if (new_assessment_data.questions_complete !== new_assessment_data.question_length && new_answer_data.question_order !== new_assessment_data.question_length) {
                            $location.path(root_url + '/answer/' + new_answer_data.assessment_ID + "-" + String(zeroFill((new_answer_data.question_order + 1), 3)));
                        } else {
                            $location.path(root_url + '/' + new_answer_data.assessment_ID);
                        }
                        rgiNotifier.notify('Answer approved');
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };
        $scope.answerClear = function () {
            $scope.answer = angular.copy($scope.$parent.answer_start);
        };

        $scope.answerReturn = function () {
            $location.path(root_url + '/' + $scope.answer.assessment_ID);
        };

        $scope.answerFlag = function () {
            $scope.value = true;
            console.log($scope);
            ngDialog.open({
                template: 'partials/dialogs/flag-answer-dialog',
                controller: 'rgiFlagAnswerDialogCtrl',
                className: 'ngdialog-theme-default dialogwidth800',
                scope: $scope
            });
        };

        //// make final choice
        //$scope.finalChoiceDialog = function () {
        //    $scope.value = true;
        //    ngDialog.open({
        //        template: 'partials/admin/assessments/final-choice-dialog',
        //        controller: 'rgiFinalChoiceDialogCtrl',
        //        className: 'ngdialog-theme-plain',
        //        scope: $scope
        //    });
        //};

    });
'use strict';
var angular;
/*jslint nomen: true*/

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}

angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier, $location) {
    $scope.identity = rgiIdentitySrvc;
    // var assessment_ID = $routeParams.answer_ID.substring(0,2);
    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        $scope.answer_start = angular.copy($scope.answer);

    });

    $scope.flagCheck = function (flags) {
        var disabled = false;
        if (flags.length !== 0) {
            flags.forEach(function (el, i) {
                if (el.addressed === false) {
                    disabled = true;
                }
            });
        }
        return disabled;
    }

    $scope.answerClear = function () {
        $scope.answer = angular.copy($scope.answer_start);
    };

    $scope.answerSave = function () {
        var new_answer_data = $scope.answer;

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Answer saved');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };

    $scope.answerSubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status !== 'submitted') {
            new_answer_data.status = 'submitted';
            new_assessment_data.questions_complete += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.question_order !== 4) {
                    $location.path('/assessments/assessment-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/assessments/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer submitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.answerApprove = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status === 'submitted') {
            new_answer_data.status = 'approved';
            new_assessment_data.questions_complete += 1;
        } else if (new_answer_data.status === 'flagged') {
            new_answer_data.status = 'approved';
            new_assessment_data.questions_flagged -= 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.question_order !== 4) {
                    $location.path('admin/assessment-review/answer-review-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/admin/assessment-review/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer approved');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.answerFlag = function (current_user) {
        var new_answer_data = $scope.answer, 
            new_assessment_data = $scope.assessment,
            new_flag_data = {
                content: $scope.answer.new_flag,
                author_name: current_user.firstName + ' ' + current_user.lastName,
                author: current_user._id,
                role: current_user.role,
                date: new Date().toISOString(),
                addressed: false
            };
        new_answer_data.flags.push(new_flag_data);

        if (new_answer_data.status === 'submitted') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_complete += 1;
            new_assessment_data.questions_flagged += 1;
        } else if (new_answer_data.status === 'approved') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_flagged += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.question_order !== 4) {
                    $location.path('admin/assessment-review/answer-review-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/assessments/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer flagged');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
        
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data = {
            content: $scope.answer.new_comment,
            author_name: current_user.firstName + ' ' + current_user.lastName,
            author: current_user._id,
            role: current_user.role,
            date: new Date().toISOString()
        },
            new_answer_data = $scope.answer;

        new_answer_data.comments.push(new_comment_data);

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Comment added');
            $scope.answer.new_comment = undefined;
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});
'use strict';
var angular;
angular.module('app').controller('rgiQuestionAdminDetailCtrl', function ($scope, $routeParams, $location, rgiNotifier, rgiQuestionMethodSrvc, rgiQuestionSrvc, rgiIdentitySrvc) {

    $scope.question = rgiQuestionSrvc.get({_id: $routeParams.id});
    $scope.current_user = rgiIdentitySrvc.currentUser;

    $scope.componentOptions = [
        {value: 'context', text: 'Context'},
        {value: 'government_effectiveness', text: 'Government Effectiveness'},
        {value: 'institutional_and_legal_setting', text: 'Institutional and Legal Setting'},
        {value: 'reporting_practices', text: 'Reporting Practices'},
        {value: 'safeguard_and_quality_control', text: 'Safeguard and Quality Control'},
        {value: 'enabling_environment', text: 'Enabling Environment'}
    ];

    $scope.questionOptionAdd = function () {
        $scope.question.question_choices.push({order: $scope.question.question_choices.length + 1, criteria: "Enter text"});
    };

    $scope.optionDelete = function (index) {
        $scope.question.question_choices.splice(index, 1);
        var i;
        for (i = $scope.question.question_choices.length - 1; i >= 0; i -= 1) {
            $scope.question.question_choices[i].order = i + 1;
        }
    };

    $scope.questionUpdate = function () {
        var new_question_data = $scope.question;
        rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
            $location.path('/admin/question-admin');
            rgiNotifier.notify('Question data has been updated');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };

    $scope.questionDelete = function () {
        var questionDeletion = $scope.question._id;

        rgiQuestionMethodSrvc.deleteQuestion(questionDeletion).then(function () {
            $location.path('/admin/question-admin');
            rgiNotifier.notify('Question has been deleted');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data, new_question_data;

        new_comment_data = {
            content: $scope.question.new_comment,
            author_name: current_user.firstName + ' ' + current_user.lastName,
            author: current_user._id,
            role: current_user.roles[0],
            date: new Date().toISOString()
        };
        new_question_data = $scope.question;

        new_question_data.comments.push(new_comment_data);
        console.log(new_question_data);
        console.log(new_comment_data);

        rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
            rgiNotifier.notify('Comment added');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});
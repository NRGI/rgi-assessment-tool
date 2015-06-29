'use strict';
//var angular;
/*jslint nomen: true*/

angular.module('app').controller('rgiQuestionAdminDetailCtrl', function ($scope, $routeParams, $location, ngDialog, rgiNotifier, rgiQuestionMethodSrvc, rgiQuestionSrvc, rgiIdentitySrvc) {
    rgiQuestionSrvc.get({_id: $routeParams.id}, function (data) {
        $scope.question = data;
        $scope.question_start = angular.copy($scope.question);
    });
    $scope.question = rgiQuestionSrvc.get({_id: $routeParams.id});
    $scope.current_user = rgiIdentitySrvc.currentUser;

    $scope.component_options = [
        {value: 'context', text: 'Context'},
        {value: 'government_effectiveness', text: 'Government Effectiveness'},
        {value: 'legal', text: 'Institutional and Legal Setting'},
        {value: 'reporting', text: 'Reporting Practices'},
        {value: 'safeguard_and_quality_control', text: 'Safeguard and Quality Control'},
        {value: 'enabling_environment', text: 'Enabling Environment'},
        {value: 'oversight', text: 'Oversight'}
    ];

    $scope.questionOptionAdd = function () {
        $scope.question.question_choices.push({order: $scope.question.question_choices.length + 1, criteria: "Enter text"});
    };

    $scope.questionOptionDelete = function (index) {
        $scope.question.question_choices.splice(index, 1);

        $scope.question.question_choices.forEach(function (el, i) {
            el.order = i + 1;
        });
    };

    $scope.questionClear = function () {
        $scope.question = angular.copy($scope.question_start);
    };
    //TODO fix reording questions---update happens in question controller
    $scope.questionUpdate = function () {
        var new_question_data = $scope.question;

        rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
            $location.path('/admin/question-admin');
            rgiNotifier.notify('Question data has been updated');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };
    $scope.deleteConfirmDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/dialogs/delete-question-confirmation-dialog',
            controller: 'rgiDeleteQuestionDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data, new_question_data;

        new_comment_data = {
            content: $scope.question.new_comment,
            author_name: current_user.firstName + ' ' + current_user.lastName,
            author: current_user._id,
            role: current_user.role,
            date: new Date().toISOString()
        };
        new_question_data = $scope.question;
        delete new_question_data.new_comment;

        new_question_data.comments.push(new_comment_data);

        rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
            rgiNotifier.notify('Comment added');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});

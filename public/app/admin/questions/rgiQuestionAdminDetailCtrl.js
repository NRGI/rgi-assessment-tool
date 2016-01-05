angular
    .module('app')
    .controller('rgiQuestionAdminDetailCtrl', function (
        $scope,
        $route,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc,
        rgiIdentitySrvc,
        rgiDialogFactory
    ) {
        'use strict';
        $scope.question = rgiQuestionSrvc.get({_id: $routeParams.id});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.page_type = 'question';

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
            $route.reload();
        };
        //TODO fix reording questions---update happens in question controller
        $scope.questionUpdate = function () {
            var new_question_data = $scope.question;
            if (new_question_data.question_criteria.length < 1) {
                rgiNotifier.error('You must supply at least one option!');
            } else if (!new_question_data.question_guidance_text) {
                rgiNotifier.error('You must supply question guidance!');
            } else if (!new_question_data.question_order) {
                rgiNotifier.error('you must supply question order!');
            } else if (!new_question_data.question_text) {
                rgiNotifier.error('You must supply question text!');
            } else {
                rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
                    $location.path('/admin/question-admin');
                    rgiNotifier.notify('Question data has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };

        $scope.deleteConfirmDialog = function () {
            rgiDialogFactory.questionDelete($scope);
        };
    });
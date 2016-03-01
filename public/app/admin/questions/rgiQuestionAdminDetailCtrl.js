'use strict';

angular.module('app')
    .controller('rgiQuestionAdminDetailCtrl', function (
        $scope,
        $route,
        $routeParams,
        $location,
        ngDialog,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiNotifier,
        rgiPreceptGuideSrvc,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc
    ) {
        $scope.question = rgiQuestionSrvc.get({_id: $routeParams.id});
        $scope.page_type = 'question';

        $scope.precept_options = rgiPreceptGuideSrvc.getPrecepts();

        $scope.type_options = [
            {value: 'context', text: 'Context'},
            {value: 'scored', text: 'Scored'},
            {value: 'shadow', text: 'Shadow'}
        ];

        $scope.component_options = [
            {value: 'context', text: 'Context'},
            {value: 'legal', text: 'Legal and Regulatory Structure'},
            {value: 'oversight', text: 'Oversight and Compliance'},
            {value: 'reporting', text: 'Reporting and Disclosure Practices'}
        ];

        $scope.questions = [];
        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            $scope.questions = questions;

            $scope.questions.forEach(function(question) {
                question.question_criteria.forEach(function(option) {
                    if($scope.question.linkedOption === option._id) {
                        $scope.linkedQuestion = question;
                    }
                });
            });
        });

        $scope.resetLinkedOption = function() {
            $scope.question.linkedOption = undefined;
        };

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
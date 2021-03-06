'use strict';

angular.module('app')
    .controller('rgiQuestionAdminDetailCtrl', ['$scope', '$route', '$routeParams', '$location', 'rgiDialogFactory', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiPreceptGuideSrvc', 'rgiQuestionMethodSrvc', 'rgiQuestionSrvc', 'rgiSortableGuideSrvc', function (
        $scope,
        $route,
        $routeParams,
        $location,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiPreceptGuideSrvc,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc,
        rgiSortableGuideSrvc
    ) {
        rgiQuestionSrvc.get({_id: $routeParams.id}, function(mainQuestion) {
            $scope.question = mainQuestion;

            rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
                $scope.questions = questions;

                $scope.questions.forEach(function(question) {
                    question.question_criteria.forEach(function(option) {
                        if($scope.question.linkedOption === option._id) {
                            $scope.linkedQuestion = question;
                        }
                    });
                });
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

        $scope.questions = [];
        $scope.page_type = 'question';
        $scope.precept_options = rgiPreceptGuideSrvc.getPrecepts();

        $scope.type_options = [
            {value: 'context', text: 'Context'},
            {value: 'scored', text: 'Scored'},
            {value: 'shadow', text: 'Shadow'}
        ];

        $scope.component_options = [
            {value: 'legal', text: 'Legal and Regulatory Structure'},
            {value: 'oversight', text: 'Oversight and Compliance'},
            {value: 'reporting', text: 'Reporting and Disclosure Practices'}
        ];

        $scope.resetLinkedOption = function() {
            $scope.question.linkedOption = undefined;
        };

        $scope.questionOptionAdd = function () {
            var values = getOptionsValues('value');
            values.sort();

            var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
            var letters = getOptionsValues('letter');

            alphabet = alphabet.filter(function(letter) {
                return letters.indexOf(letter) === -1;
            });

            $scope.question.question_criteria.push({
                letter: alphabet.length > 0 ? alphabet[0] : '',
                order: $scope.question.question_criteria.length + 1,
                text: '',
                value: values.length > 0 ? values[values.length - 1] + 1 : 1
            });
        };

        $scope.questionOptionDelete = function (index) {
            $scope.question.question_criteria.splice(index, 1);

            $scope.question.question_criteria.forEach(function (el, i) {
                el.order = i + 1;
            });
        };

        var getOptionsValues = function(optionField) {
            var values = [];

            $scope.question.question_criteria.forEach(function(option) {
                values.push(option[optionField]);
            });

            return values;
        };

        $scope.validateOptionValue = function(optionField, elementNamePrefix) {
            if($scope.question !== undefined) {
                var valid, values = getOptionsValues(optionField);

                $scope.question.question_criteria.forEach(function(option, optionIndex) {
                    valid = true;

                    values.forEach(function(value, valueIndex) {
                        if((value === option[optionField]) && (optionIndex !== valueIndex)) {
                            valid = false;
                        }
                    });

                    $scope.question_content_form[elementNamePrefix + optionIndex].$setValidity('duplicated', valid);
                });
            }
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

        $scope.sortableOptions = rgiSortableGuideSrvc.getDefaultOptions(function() {
            $scope.question.question_criteria.forEach(function(criterion, index) {
                criterion.order = index + 1;
            });
        });
    }]);

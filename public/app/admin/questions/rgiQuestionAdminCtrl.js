'use strict';

angular.module('app')
    .controller('rgiQuestionAdminCtrl', ['$scope', 'rgiDialogFactory', 'rgiHttpResponseProcessorSrvc', 'rgiPreceptGuideSrvc', 'rgiQuestionSrvc', function (
        $scope,
        rgiDialogFactory,
        rgiHttpResponseProcessorSrvc,
        rgiPreceptGuideSrvc,
        rgiQuestionSrvc
    ) {
        $scope.order_reverse = true;
        $scope.questions = rgiPreceptGuideSrvc.getQuestionTemplates();

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            questions.forEach(function (question) {
                $scope.questions[question.precept - 1].data.push(question);
            });
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

        $scope.getExportedQuestions = function() {
            var exportedQuestions = [];

            var getExportedQuestion = function(question) {
                var exportedData = {
                    question_order: question.question_order,
                    question_label: question.question_label,
                    precept: question.precept,
                    question_type: question.question_type,
                    question_text: question.question_text,
                    component_text: question.component_text,
                    indicator_name: question.indicator_name,
                    dejure: question.dejure
                };

                question.question_criteria.forEach(function (criterion, index) {
                    exportedData['choice_' + String(index)] = criterion.name;
                    exportedData['choice_' + String(index) + '_criteria'] = criterion.text;
                });

                return exportedData;
            };

            var addExportedQuestion = function(question) {
                exportedQuestions.push(getExportedQuestion(question));
            };

            for(var precept in $scope.questions) {
                if($scope.questions.hasOwnProperty(precept)) {
                    $scope.questions[precept].data.forEach(addExportedQuestion);
                }
            }

            return exportedQuestions;
        };

        $scope.newQuestionDialog = function () {
            rgiDialogFactory.questionNew($scope);
        };
    }]);

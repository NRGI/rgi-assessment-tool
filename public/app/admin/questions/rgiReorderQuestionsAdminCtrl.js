'use strict';

angular.module('app')
    .controller('rgiReorderQuestionsAdminCtrl', function (
        $scope,
        rgiHttpResponseProcessorSrvc,
        rgiPreceptGuideSrvc,
        rgiQuestionSrvc,
        rgiSortableGuideSrvc
    ) {
        $scope.precepts = rgiPreceptGuideSrvc.getQuestionTemplates();

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            questions.forEach(function (question) {
                $scope.precepts[question.precept - 1].data.push(question);
            });

            $scope.precepts.forEach(function(precept) {
                precept.data.sort(function(questionA, questionB) {
                    return questionA.question_order - questionB.question_order;
                });
            });

            $scope.questions = questions;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

        var updateOrder = function() {
            var questionOrder = 0;

            $scope.precepts.forEach(function(precept) {
                precept.data.forEach(function(question) {
                    question.question_order = questionOrder++;
                });
            });
        };

        $scope.sortableOptions = rgiSortableGuideSrvc.getOptions(true, {
            orderChanged: updateOrder
        });
    });

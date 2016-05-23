'use strict';

angular.module('app')
    .factory('rgiQuestionMethodSrvc', function (
        rgiQuestionSrvc,
        rgiResourceProcessorSrvc
    ) {
        return {
            updateQuestionSet: function (questionsData) {
                var questions = new rgiQuestionSrvc(questionsData);
                questions.length = questionsData.length;
                return rgiResourceProcessorSrvc.process(questions, '$update');
            },
            updateQuestion: function (question) {
                return rgiResourceProcessorSrvc.process(question, '$update');
            },
            deleteQuestion: function (questionId) {
                return rgiResourceProcessorSrvc.delete(rgiQuestionSrvc, questionId);
            }
        };
    });

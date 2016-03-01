'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiUtilsSrvc) {
    var answers = [];

    return {
        isAnyQuestionRemaining: function(answer) {
            return answer.question_order !== answers.length;
        },
        getNextQuestionId: function(answer) {
            return String(rgiUtilsSrvc.zeroFill((answer.question_order + 1), 3));
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };
});

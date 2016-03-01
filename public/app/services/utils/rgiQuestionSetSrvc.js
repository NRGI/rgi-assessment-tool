'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc, rgiUtilsSrvc) {
    var answers = [], questions;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
        questions = questionList;
    });

    var getNextQuestion = function(answer) {
        var linkedQuestion = getLinkedQuestion(getQuestionOption(answer));
        return linkedQuestion === undefined ? getRootQuestions()[0] : linkedQuestion;
    };

    var getLinkedQuestion = function(option) {
        var foundQuestion;

        questions.forEach(function(question) {
            if(question.linkedOption === option._id) {
                foundQuestion = question;
            }
        });

        return foundQuestion;
    };

    var getQuestionOption = function(answer) {
        var foundOption;

        questions.forEach(function(question) {
            if(answer.root_question_ID === question._id) {
                question.question_criteria.forEach(function(option) {
                    if(answer.researcher_score.text === option.text) {
                        foundOption = option;
                    }
                });
            }
        });

        return foundOption;
    };

    var getRootQuestions = function() {
        var rootQuestions = [];

        questions.forEach(function(question) {
            if((question.linkedOption === undefined) && !isQuestionAnswered(question)) {
                rootQuestions.push(question);
            }
        });

        return rootQuestions;
    };

    var isQuestionAnswered = function(question) {
        var answered = false;

        answers.forEach(function(answer) {
            if((answer.root_question_ID === question._id) && answer.researcher_score) {
                answered = true;
            }
        });

        return answered;
    };

    return {
        isAnyQuestionRemaining: function(answer) {
            return getNextQuestion(answer) !== undefined;
        },
        getNextQuestionId: function(answer) {
            return String(rgiUtilsSrvc.zeroFill((getNextQuestion(answer).question_order), 3));
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };
});

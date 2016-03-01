'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc, rgiUtilsSrvc) {
    var answers = [], questions;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
        questions = questionList;
    });

    var getNextQuestion = function(answer) {
        var linkedQuestion = getLinkedQuestion(getQuestionOption(answer));
        return linkedQuestion === undefined ? getRootQuestions(false)[0] : linkedQuestion;
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
            if(isQuestionAssociated(answer, question)) {
                question.question_criteria.forEach(function(option) {
                    if(answer.researcher_score.text === option.text) {
                        foundOption = option;
                    }
                });
            }
        });

        return foundOption;
    };

    var getRootQuestions = function(showAnsweredQuestions) {
        var rootQuestions = [];

        questions.forEach(function(question) {
            if((question.linkedOption === undefined) && (!isQuestionAnswered(question) || showAnsweredQuestions)) {
                rootQuestions.push(question);
            }
        });

        return rootQuestions;
    };

    var isQuestionAssociated = function(answer, question) {
        return answer.question_ID._id === question._id;
    };

    var getAssociatedQuestion = function(answer) {
        var associatedQuestion;

        questions.forEach(function(question) {
            if(isQuestionAssociated(answer, question)) {
                associatedQuestion = question;
            }
        });

        return associatedQuestion;
    };

    var isQuestionAnswered = function(question) {
        var answered = false;

        answers.forEach(function(answer) {
            if(isQuestionAssociated(answer, question) && answer.researcher_score) {
                answered = true;
            }
        });

        return answered;
    };

    return {
        getNextQuestionId: function(answer) {
            return String(rgiUtilsSrvc.zeroFill((getNextQuestion(answer).question_order), 3));
        },
        isAnyQuestionRemaining: function(answer) {
            return getNextQuestion(answer) !== undefined;
        },
        isAvailable: function(answer) {
            var rootQuestions = getRootQuestions(true),
                associatedQuestion = getAssociatedQuestion(answer),
                isRootQuestion = false;

            rootQuestions.forEach(function(question) {
                if(question._id === associatedQuestion._id) {
                    isRootQuestion = true;
                }
            });

            return isRootQuestion;
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };
});

'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc, rgiUtilsSrvc) {
    var answers = [], questions;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
        questions = questionList;
    });

    var getNextQuestion = function(answer) {
        var linkedQuestion = getLinkedQuestion(getQuestionSelectedOption(answer));
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

    var getSelectedOption = function(answer) {
        return answer.researcher_score;
    };

    var getQuestionSelectedOption = function(answer) {
        var foundOption;

        questions.forEach(function(question) {
            if(isAssociatedQuestion(answer, question)) {
                question.question_criteria.forEach(function(option) {
                    if(getSelectedOption(answer).text === option.text) {
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

    var isAssociatedQuestion = function(answer, question) {
        return answer.question_ID._id === question._id;
    };

    var getAssociatedQuestion = function(answer) {
        var associatedQuestion;

        questions.forEach(function(question) {
            if(isAssociatedQuestion(answer, question)) {
                associatedQuestion = question;
            }
        });

        return associatedQuestion;
    };

    var isQuestionAnswered = function(question) {
        var answered = false;

        answers.forEach(function(answer) {
            if(isAssociatedQuestion(answer, question) && getSelectedOption(answer)) {
                answered = true;
            }
        });

        return answered;
    };

    var getAvailableLinkedQuestions = function() {
        var availableLinkedQuestions = [];

        answers.forEach(function(answer) {
            if(getSelectedOption(answer)) {
                var linkedQuestion = getLinkedQuestion(getQuestionSelectedOption(answer));
                if(linkedQuestion) {
                    availableLinkedQuestions.push(linkedQuestion);
                }
            }
        });

        return availableLinkedQuestions;
    };

    var isQuestionFound = function(associatedQuestion, questions) {
        var questionFound = false;

        questions.forEach(function(question) {
            if(question._id === associatedQuestion._id) {
                questionFound = true;
            }
        });

        return questionFound;
    };

    return {
        getNextQuestionId: function(answer) {
            return String(rgiUtilsSrvc.zeroFill((getNextQuestion(answer).question_order), 3));
        },
        isAnyQuestionRemaining: function(answer) {
            return getNextQuestion(answer) !== undefined;
        },
        isAvailable: function(answer) {
            var question = getAssociatedQuestion(answer);
            return isQuestionFound(question, getRootQuestions(true)) || isQuestionFound(question, getAvailableLinkedQuestions());
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };
});
'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc, rgiUtilsSrvc) {
    var answers = [], questions;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
        questions = questionList;
    });

    var getNextQuestion = function(answer) {
//<<<<<<< 60e02369f0ae31e5de028b81b974875ae9ac9a8d
        var linkedQuestion = getLinkedQuestion(getQuestionSelectedOption(answer));
        return linkedQuestion === undefined ? getRootQuestions(false)[0] : linkedQuestion;
//=======
//        var linkedQuestion = getLinkedQuestion(getQuestionOption(answer));
//        return linkedQuestion === undefined ? getRootQuestions()[0] : linkedQuestion;
//>>>>>>> fix navigation to the next question on answer submission
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

//<<<<<<< 60e02369f0ae31e5de028b81b974875ae9ac9a8d
    var getSelectedOption = function(answer) {
        return answer.researcher_score;
    };

    var getQuestionSelectedOption = function(answer) {
        var foundOption;

        questions.forEach(function(question) {
            if(isAssociatedQuestion(answer, question)) {
                question.question_criteria.forEach(function(option) {
                    if(getSelectedOption(answer).text === option.text) {
//=======
//    var getQuestionOption = function(answer) {
//        var foundOption;
//
//        questions.forEach(function(question) {
//            if(answer.root_question_ID === question._id) {
//                question.question_criteria.forEach(function(option) {
//                    if(answer.researcher_score.text === option.text) {
//>>>>>>> fix navigation to the next question on answer submission
                        foundOption = option;
                    }
                });
            }
        });

        return foundOption;
    };

//<<<<<<< 60e02369f0ae31e5de028b81b974875ae9ac9a8d
    var getRootQuestions = function(showAnsweredQuestions) {
        var rootQuestions = [];

        questions.forEach(function(question) {
            if((question.linkedOption === undefined) && (!isQuestionAnswered(question) || showAnsweredQuestions)) {
//=======
//    var getRootQuestions = function() {
//        var rootQuestions = [];
//
//        questions.forEach(function(question) {
//            if((question.linkedOption === undefined) && !isQuestionAnswered(question)) {
//>>>>>>> fix navigation to the next question on answer submission
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
//<<<<<<< 60e02369f0ae31e5de028b81b974875ae9ac9a8d
            if(isAssociatedQuestion(answer, question) && getSelectedOption(answer)) {
//=======
//            if((answer.root_question_ID === question._id) && answer.researcher_score) {
//>>>>>>> fix navigation to the next question on answer submission
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
//<<<<<<< 60e02369f0ae31e5de028b81b974875ae9ac9a8d
        isAvailable: function(answer) {
            var question = getAssociatedQuestion(answer);
            return isQuestionFound(question, getRootQuestions(true)) || isQuestionFound(question, getAvailableLinkedQuestions());
//=======
//        getNextQuestionId: function(answer) {
//            return String(rgiUtilsSrvc.zeroFill((getNextQuestion(answer).question_order), 3));
//>>>>>>> fix navigation to the next question on answer submission
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };
});

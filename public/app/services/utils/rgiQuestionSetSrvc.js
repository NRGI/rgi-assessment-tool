'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc, rgiUtilsSrvc) {
    var answers = [], questions;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
        questions = questionList;
    });

    var getRootQuestions = function(role, showAnsweredQuestions) {
        var rootQuestions = [];

        questions.forEach(function(question) {
            if((question.linkedOption === undefined) &&
                (!getAnswerChoice(role, getAssociatedAnswer(question)) || showAnsweredQuestions)) {
                rootQuestions.push(question);
            }
        });

        return rootQuestions;
    };

    var getLinkedQuestions = function(role, showAnsweredQuestions, currentAnswer) {
        var availableLinkedQuestions = [];

        answers.forEach(function(answer) {
            var choice = getAnswerChoice('researcher', answer);

            if(choice) {
                var question = getLinkedQuestion(getQuestionSelectedOption(getAssociatedQuestion(answer), choice));

                if(question !== null) {
                    if(!getAnswerChoice(role, getAssociatedAnswer(question)) || showAnsweredQuestions) {
                        if((currentAnswer !== undefined) && (currentAnswer._id === answer.id)) {
                            availableLinkedQuestions = [question].concat(availableLinkedQuestions);
                        } else {
                            availableLinkedQuestions.push(question);
                        }
                    }
                }
            }
        });

        return availableLinkedQuestions;
    };

    var getLinkedQuestion = function(option) {
        var foundQuestion = null;

        if(option !== null) {
            questions.forEach(function(question) {
                if(question.linkedOption === option._id) {
                    foundQuestion = question;
                }
            });
        }

        return foundQuestion;
    };

    var getAnswerChoice = function(role, answer) {
        return answer[getChoiceField(role)];
    };

    var getChoiceField = function(role) {
        return (['researcher', 'reviewer'].indexOf(role) === -1 ? 'final' : role) + '_score';
    };

    var getQuestionSelectedOption = function(question, answerChoice) {
        var selectedOption = null;

        if(question !== null) {
            question.question_criteria.forEach(function(option) {
                if(answerChoice.text === option.text) {
                    selectedOption = option;
                }
            });
        }

        return selectedOption;
    };

    var isAssociatedQuestion = function(answer, question) {
        return answer.question_ID._id === question._id;
    };

    var getAssociatedAnswer = function(question) {
        var associatedAnswer = null;

        answers.forEach(function(answer) {
            if(isAssociatedQuestion(answer, question)) {
                associatedAnswer = answer;
            }
        });

        return associatedAnswer;
    };

    var getAssociatedQuestion = function(answer) {
        var associatedQuestion = null;

        questions.forEach(function(question) {
            if(isAssociatedQuestion(answer, question)) {
                associatedQuestion = question;
            }
        });

        return associatedQuestion;
    };

    var questionSet = {
        getAvailableQuestions: function(role, showAnsweredQuestions, answer) {
            return getLinkedQuestions(role, showAnsweredQuestions, answer)
                .concat(getRootQuestions(role, showAnsweredQuestions));
        },
        getNextQuestionId: function(role, answer) {
            var availableQuestions = questionSet.getAvailableQuestions(role, false, answer);
            return String(rgiUtilsSrvc.zeroFill((availableQuestions[0].question_order), 3));
        },
        isAnyQuestionRemaining: function(role) {
            return questionSet.getAvailableQuestions(role, false).length > 0;
        },
        isAvailable: function(role, answer) {
            var
                associatedQuestion = getAssociatedQuestion(answer),
                questionFound = false;

            questionSet.getAvailableQuestions(role, true).forEach(function(question) {
                if(question._id === associatedQuestion._id) {
                    questionFound = true;
                }
            });

            return questionFound;
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };

    return questionSet;
});

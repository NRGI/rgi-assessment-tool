'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', function (rgiQuestionSrvc) {
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

    var getLinkedQuestions = function(role, showAnsweredQuestions) {
        var availableLinkedQuestions = [];

        answers.forEach(function(answer) {
            var choice = getAnswerChoice('researcher', answer);

            if(choice) {
                var question = getLinkedQuestion(getQuestionSelectedOption(getAssociatedQuestion(answer), choice));

                if(question !== null) {
                    if(!getAnswerChoice(role, getAssociatedAnswer(question)) || showAnsweredQuestions) {
                        availableLinkedQuestions.push(question);
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

    var getRelativeQuestion = function(offset, role, showAnsweredQuestions, answer) {
        var answerIndex = -1,
            questions = questionSet.getAvailableQuestions(role, showAnsweredQuestions);

        for(var index in questions) {
            if(questions.hasOwnProperty(index) && (questions[index].question_order === answer.question_order)) {
                answerIndex = index;
            }
        }

        return questions[answerIndex + offset];
    };

    var questionSet = {
        getAvailableQuestions: function(role, showAnsweredQuestions) {
            return getRootQuestions(role, showAnsweredQuestions)
                .concat(getLinkedQuestions(role, showAnsweredQuestions));
        },
        getNextQuestionId: function(role, showAnsweredQuestions, answer) {
            return getRelativeQuestion(1, role, showAnsweredQuestions, answer).question_order;
        },
        getPrevQuestionId: function(role, showAnsweredQuestions, answer) {
            return getRelativeQuestion(-1, role, showAnsweredQuestions, answer).question_order;
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

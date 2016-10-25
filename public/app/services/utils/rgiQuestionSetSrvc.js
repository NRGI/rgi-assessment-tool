'use strict';

angular.module('app').factory('rgiQuestionSetSrvc', ['rgiHttpResponseProcessorSrvc', 'rgiQuestionSrvc', function (rgiHttpResponseProcessorSrvc, rgiQuestionSrvc) {
    var answers = [], questions = [];

    var getRootQuestions = function(roles, showAnsweredQuestions) {
        var rootQuestions = [];

        questions.forEach(function(question) {
            if((question.linkedOption === undefined) && (getAssociatedAnswer(question) !== null) &&
                ((getAnswerChoices(roles, getAssociatedAnswer(question)).length === 0) || showAnsweredQuestions)) {
                rootQuestions.push(question);
            }
        });

        return rootQuestions;
    };

    var getLinkedQuestions = function(roles, showAnsweredQuestions) {
        var availableLinkedQuestions = [];

        answers.forEach(function(answer) {
            if(answer !== null) {
                getAnswerChoices(roles, answer).forEach(function(choice) {
                    var question = getLinkedQuestion(getQuestionSelectedOption(getAssociatedQuestion(answer), choice));

                    if(question !== null) {
                        if((getAnswerChoices(roles, getAssociatedAnswer(question)).length === 0) || showAnsweredQuestions) {
                            availableLinkedQuestions.push(question);
                        }
                    }
                });
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

    var getAnswerChoices = function(roles, answer) {
        var choices = [];

        roles.forEach(function(role) {
            var choice = answer[getChoiceField(role)];
            if(choice !== undefined) {
                choices.push(choice);
            }
        });

        return choices;
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
        var questions = questionSet.getAvailableQuestions(role, showAnsweredQuestions);

        for(var questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            if(questions[questionIndex].question_order === answer.question_order) {
                return questions[questionIndex + offset];
            }
        }
    };

    var getRoles = function(role) {
        var roles = ['researcher'];

        if(['researcher', 'ext_reviewer'].indexOf(role) === -1) {
            roles.push('reviewer');
        }

        if(roles.indexOf(role) === -1) {
            roles.push(role);
        }

        return roles;
    };

    var questionSet = {
        getAvailableQuestions: function(role, showAnsweredQuestions) {
            return getRootQuestions(getRoles(role), showAnsweredQuestions)
                .concat(getLinkedQuestions(getRoles(role), showAnsweredQuestions));
        },
        getNextQuestionId: function(role, showAnsweredQuestions, answer) {
            return getRelativeQuestion(1, role, showAnsweredQuestions, answer).question_order;
        },
        getPrevQuestionId: function(role, showAnsweredQuestions, answer) {
            return getRelativeQuestion(-1, role, showAnsweredQuestions, answer).question_order;
        },
        isAnyQuestionRemaining: function(role, showAnsweredQuestions, answer) {
            return getRelativeQuestion(1, role, showAnsweredQuestions, answer) !== undefined;
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
        loadQuestions: function(callback) {
            rgiQuestionSrvc.queryCached({assessment_ID: 'base'}, function (questionList) {
                questionList.sort(function(question1, question2){return question1.question_order - question2.question_order;});
                questions = questionList;
                callback();
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));
        },
        setAnswers: function(answersData) {
            answers = answersData;
        }
    };

    return questionSet;
}]);

'use strict';
angular.module('app')
    .controller('rgiAssessmentDetailTableCtrl', function (
        $scope,
        rgiIdentitySrvc,
        rgiQuestionSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        var questions;

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
            questions = questionList;
        });

        var getQuestion = function(answer) {
            var foundQuestion = false;

            questions.forEach(function(question) {
                if(question._id === answer.root_question_ID) {
                    foundQuestion = question;
                }
            });

            return foundQuestion;
        };

        var isRootQuestion = function(answer) {
            return !getQuestion(answer).linkedOption;
        };

        var isLinkedToAnsweredQuestion = function(answer, answeredQuestionOptions) {
            return answeredQuestionOptions.indexOf(getQuestion(answer).linkedOption) !== -1;
        };

        var getOption = function(options, optionData) {
            var foundOption;

            options.forEach(function(option) {
                if(option.text === optionData.text) {
                    foundOption = option;
                }
            });

            return foundOption;
        };

        var getAnsweredOptions = function() {
            var options = [];

            $scope.answers.forEach(function(answer) {
                if(answer.researcher_score) {
                    options.push(getOption(getQuestion(answer).question_criteria, answer.researcher_score)._id);
                }
            });

            return options;
        };

        $scope.isAnswerAvailable = function(answer) {
            return isRootQuestion(answer) || isLinkedToAnsweredQuestion(answer, getAnsweredOptions());
        };
    });
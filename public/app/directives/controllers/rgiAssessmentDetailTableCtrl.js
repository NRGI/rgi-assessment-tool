'use strict';
angular.module('app')
    .controller('rgiAssessmentDetailTableCtrl', function (
        $scope,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiQuestionSrvc,
        rgiUserListSrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        var
            questions = [],
            users = {};

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questionList) {
            questions = questionList;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

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

        $scope.getUser = function(userId) {
            if(!users.hasOwnProperty(userId)) {
                users[userId] = rgiUserListSrvc.get({_id: userId});
            }
            return users[userId];
        };

        $scope.isAnswerAvailable = function(answer) {
            return isRootQuestion(answer) || isLinkedToAnsweredQuestion(answer, getAnsweredOptions());
        };
    });

'use strict';

angular
    .module('app')
    .controller('rgiAnswerNavCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiAnswerSrvc,
        rgiUrlGuideSrvc
    ) {
        var answersNumber,
            answerAttributes = $routeParams.answer_ID.split('-'),
            assessmentId = answerAttributes.slice(0, answerAttributes.length - 1).join('-'),
            currentAnswerOrder = Number(answerAttributes[3]),
            redirectToAnswerPage = function(answerOrder) {
                $location.path(rgiUrlGuideSrvc.getAnswerUrl(assessmentId, answerOrder));
            };

        rgiAnswerSrvc.query({assessment_ID: assessmentId}, function (answers) {
            answersNumber = answers.length;
        });

        $scope.isFirstAnswer = function() {
            return currentAnswerOrder === 1;
        };

        $scope.isLastAnswer = function() {
            return currentAnswerOrder === answersNumber;
        };

        $scope.moveBackward = function () {
            redirectToAnswerPage(currentAnswerOrder - 1);
        };

        $scope.moveForward = function () {
            redirectToAnswerPage(currentAnswerOrder + 1);
        };

        $scope.moveFirst = function () {
            redirectToAnswerPage(1);
        };

        $scope.moveLast = function () {
            redirectToAnswerPage(answersNumber);
        };
    });

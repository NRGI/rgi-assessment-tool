'use strict';

angular
    .module('app')
    .controller('rgiAnswerNavCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiUtilsSrvc,
        rgiIdentitySrvc,
        rgiAnswerSrvc
    ) {
        var answersNumber,
            answerAttributes = $routeParams.answer_ID.split('-'),
            assessmentId = answerAttributes.slice(0, answerAttributes.length - 1).join('-'),
            currentAnswerOrder = Number(answerAttributes[3]),
            getRootUrl = function(role) {
                return role === 'supervisor' ? '/admin/assessments-admin/answer/' : '/assessments/answer/';
            },
            getUrl = function(answerOrder) {
                return getRootUrl(rgiIdentitySrvc.currentUser.role) + assessmentId + "-" +
                    String(rgiUtilsSrvc.zeroFill(answerOrder, 3));
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
            $location.path(getUrl(currentAnswerOrder - 1));
        };

        $scope.moveForward = function () {
            $location.path(getUrl(currentAnswerOrder + 1));
        };

        $scope.moveFirst = function () {
            $location.path(getUrl(1));
        };

        $scope.moveLast = function () {
            $location.path(getUrl(answersNumber));
        };
    });

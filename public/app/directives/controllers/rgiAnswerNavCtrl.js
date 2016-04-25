'use strict';

angular
    .module('app')
    .controller('rgiAnswerNavCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiIdentitySrvc,
        rgiQuestionSetSrvc,
        rgiUrlGuideSrvc
    ) {
        var answerAttributes = $routeParams.answer_ID.split('-'),
            assessmentId = answerAttributes.slice(0, answerAttributes.length - 1).join('-'),
            currentAnswerOrder = Number(answerAttributes[3]),
            role = rgiIdentitySrvc.currentUser.role,
            redirectToAnswerPage = function(answerOrder) {
                $location.path(rgiUrlGuideSrvc.getAnswerUrl(assessmentId, answerOrder));
            },
            questionOrders = [];

        rgiQuestionSetSrvc.getAvailableQuestions(role, true).forEach(function(question) {
            questionOrders.push(question.question_order);
        });

        questionOrders.sort();

        $scope.isFirstAnswer = function() {
            return (questionOrders.length > 0) && (currentAnswerOrder === questionOrders[0]);
        };

        $scope.isLastAnswer = function() {
            return (questionOrders.length > 0) && (currentAnswerOrder === questionOrders[questionOrders.length - 1]);
        };

        $scope.moveBackward = function () {
            redirectToAnswerPage(rgiQuestionSetSrvc.getPrevQuestionId(role, true, {question_order: currentAnswerOrder}));
        };

        $scope.moveForward = function () {
            redirectToAnswerPage(rgiQuestionSetSrvc.getNextQuestionId(role, true, {question_order: currentAnswerOrder}));
        };

        $scope.moveFirst = function () {
            if(questionOrders.length > 0) {
                redirectToAnswerPage(questionOrders[0]);
            }
        };

        $scope.moveLast = function () {
            if(questionOrders.length > 0) {
                redirectToAnswerPage(questionOrders[questionOrders.length - 1]);
            }
        };
    });

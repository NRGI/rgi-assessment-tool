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
            getQuestionOrders = function() {
                var orders = [];

                rgiQuestionSetSrvc.getAvailableQuestions(role, true).forEach(function(question) {
                    orders.push(question.question_order);
                });

                orders.sort();
                return orders;
            },
            redirectToAnswerPage = function(answerOrder) {
                $location.path(rgiUrlGuideSrvc.getAnswerUrl(assessmentId, answerOrder));
            };

        $scope.isFirstAnswer = function() {
            return (getQuestionOrders().length > 0) && (currentAnswerOrder === getQuestionOrders()[0]);
        };

        $scope.isLastAnswer = function() {
            return (getQuestionOrders().length > 0) &&
                (currentAnswerOrder === getQuestionOrders()[getQuestionOrders().length - 1]);
        };

        $scope.moveBackward = function () {
            redirectToAnswerPage(rgiQuestionSetSrvc.getPrevQuestionId(role, true, {question_order: currentAnswerOrder}));
        };

        $scope.moveForward = function () {
            redirectToAnswerPage(rgiQuestionSetSrvc.getNextQuestionId(role, true, {question_order: currentAnswerOrder}));
        };

        $scope.moveFirst = function () {
            if(getQuestionOrders().length > 0) {
                redirectToAnswerPage(getQuestionOrders()[0]);
            }
        };

        $scope.moveLast = function () {
            if(getQuestionOrders().length > 0) {
                redirectToAnswerPage(getQuestionOrders()[getQuestionOrders().length - 1]);
            }
        };
    });

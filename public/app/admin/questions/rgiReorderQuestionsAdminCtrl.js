'use strict';

angular.module('app')
    .controller('rgiReorderQuestionsAdminCtrl', function (
        $scope,
        rgiHttpResponseProcessorSrvc,
        rgiPreceptGuideSrvc,
        rgiQuestionSrvc,
        rgiSortableGuideSrvc
    ) {
        $scope.precepts = rgiPreceptGuideSrvc.getQuestionTemplates();

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            questions.forEach(function (question) {
                $scope.precepts[question.precept - 1].data.push(question);
            });

            $scope.precepts.forEach(function(precept) {
                precept.data.sort(function(questionA, questionB) {
                    return questionA.question_order - questionB.question_order;
                });
            });
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));

        var updateOrder = function(event) {
            event.source.itemScope.question.newPrecept = parseInt(event.dest.sortableScope.precept.id.replace('precept_', ''));
            var questionOrder = 1;

            $scope.precepts.forEach(function(precept) {
                precept.data.forEach(function(question) {
                    question.newOrder = questionOrder++;
                });
            });
        };

        $scope.sortableOptions = rgiSortableGuideSrvc.getOptions(true, {
            itemMoved: updateOrder,
            orderChanged: updateOrder
        });

        $scope.reorder = function() {

        };
    });

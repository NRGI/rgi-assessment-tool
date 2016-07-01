'use strict';

angular.module('app')
    .controller('rgiReorderQuestionsAdminCtrl', function (
        $scope,
        $q,
        rgiHttpResponseProcessorSrvc,
        rgiPreceptGuideSrvc,
        rgiNotifier,
        rgiQuestionSrvc,
        rgiQuestionMethodSrvc,
        rgiSortableGuideSrvc
    ) {
        $scope.precepts = rgiPreceptGuideSrvc.getQuestionTemplates();
        $scope.reordered = false;

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

        var isModified = function(question, field, newValueField) {
            return [undefined, question[field]].indexOf(question[newValueField]) === -1;
        };

        var updateOrder = function(event) {
            event.source.itemScope.question.newPrecept = parseInt(event.dest.sortableScope.precept.id.replace('precept_', ''));
            var questionOrder = 1;

            $scope.precepts.forEach(function(precept) {
                precept.data.forEach(function(question) {
                    question.newOrder = questionOrder++;

                    if(isModified(question, 'question_order', 'newOrder') || isModified(question, 'precept', 'newPrecept')) {
                        $scope.reordered = true;
                    }
                });
            });
        };

        $scope.sortableOptions = rgiSortableGuideSrvc.getOptions(true, {
            itemMoved: updateOrder,
            orderChanged: updateOrder
        });

        $scope.reorder = function() {
            var promises = [];

            $scope.precepts.forEach(function(precept) {
                precept.data.forEach(function(question) {
                    var questionModified = false;

                    if(isModified(question, 'question_order', 'newOrder')) {
                        question.question_order = question.newOrder;
                        questionModified = true;
                    }

                    if(isModified(question, 'precept', 'newPrecept')) {
                        question.precept = question.newPrecept;
                        questionModified = true;
                    }

                    if(questionModified) {
                        promises.push(rgiQuestionMethodSrvc.updateQuestion(question).$promise);
                    }
                });
            });

            $q.all(promises).then(function() {
                rgiNotifier.notify('The questions have been reordered');
            }, function(reason) {
                rgiNotifier.error(reason);
            });
        };
    });

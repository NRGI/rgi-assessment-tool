'use strict';

angular.module('app')
    .controller('rgiQuestionRawListCtrl', function (
        _,
        $scope,
        rgiQuestionRawSrvc
    ) {
        $scope.header = [
            'question_order',
            'question_v',
            'question_text',
            'question_criteria_letter',
            'question_criteria_text',
            'last_modified_modified_by',
            'last_modified_modified_date'
        ];

        $scope.busy = false;
        $scope.questions = [];
        $scope.itemsPerPage = 50;

        var currentPage = 0, allItemsLoaded = false,
            addQuestions = function(questions) {
                if(!questions.reason) {
                    $scope.questions = $scope.questions.concat(questions);
                    currentPage++;
                }
            };

        rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.itemsPerPage}, addQuestions);

        $scope.getExportedData = function() {
            var questions = [];

            $scope.questions.forEach(function(questionData) {
                var question = {};
                questions.push(question);
            });

            return questions;
        };

        $scope.loadMore = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allItemsLoaded) {
                rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.itemsPerPage}).$promise
                    .then(function (questions) {
                        addQuestions(questions);

                        if (!questions.reason && (questions.length < $scope.itemsPerPage)) {
                            allItemsLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

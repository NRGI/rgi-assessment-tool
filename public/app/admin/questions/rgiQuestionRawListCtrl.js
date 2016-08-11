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
        $scope.answers = [];

        var limit = 50, currentPage = 0, allAnswersLoaded = false,
            addAnswers = function(answers) {
                if(!answers.reason) {
                    $scope.answers = $scope.answers.concat(answers);
                    currentPage++;
                }
            };

        rgiQuestionRawSrvc.query({skip: currentPage, limit: limit}, addAnswers);

        $scope.getExportedData = function() {
            var answers = [];

            $scope.answers.forEach(function(answerData) {
                var answer = {};
                answers.push(answer);
            });

            return answers;
        };

        $scope.loadMore = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allAnswersLoaded) {
                rgiQuestionRawSrvc.query({skip: currentPage, limit: limit}).$promise
                    .then(function (answers) {
                        addAnswers(answers);

                        if (!answers.reason && (answers.length < limit)) {
                            allAnswersLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

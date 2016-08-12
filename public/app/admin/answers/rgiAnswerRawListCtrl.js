'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', function (_, $scope, rgiAnswerRawSrvc) {
        $scope.sort_options = [
            {value: 'answer_ID', text: 'Sort by answer id'},
            {value: 'status', text: 'Sort by Status'},
            {value: 'researcher_score_letter', text: 'Researcher letter score'},
            {value: 'reviewer_score_letter', text: 'Reviewer letter score'}
        ];

        $scope.sort_order = $scope.sort_options[0].value;
        $scope.busy = false;
        $scope.answers = [];
        $scope.portionSize = 50;

        var currentPage = 0, allAnswersLoaded = false,
            addAnswers = function(answers) {
                if(!answers.reason) {
                    $scope.answers = $scope.answers.concat(answers.data);
                    $scope.answersHeader = answers.header;
                    currentPage++;
                }
            };

        rgiAnswerRawSrvc.query({skip: currentPage, limit: $scope.portionSize}, addAnswers);

        $scope.loadMoreAnswers = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allAnswersLoaded) {
                rgiAnswerRawSrvc.query({skip: currentPage, limit: $scope.portionSize}).$promise
                    .then(function (answers) {
                        addAnswers(answers);

                        if (!answers.reason && (answers.length < $scope.portionSize)) {
                            allAnswersLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

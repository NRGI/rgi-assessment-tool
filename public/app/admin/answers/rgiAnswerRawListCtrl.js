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

        var portionSize = 100, currentPage = 0, allAnswersLoaded = false,
            addAnswers = function(answers) {
                if(!answers.reason) {
                    $scope.answers = $scope.answers.concat(answers.data);
                    $scope.answersHeader = answers.header;
                    currentPage++;
                }
            },
            fetchAnswers = function () {
                if ($scope.busy) {
                    return;
                }

                $scope.busy = true;

                if(!allAnswersLoaded) {
                    rgiAnswerRawSrvc.query({skip: currentPage, limit: portionSize}).$promise
                        .then(function (answers) {
                            addAnswers(answers);

                            if (!answers.reason && (answers.data.length < portionSize)) {
                                allAnswersLoaded = true;
                            }
                        }).finally(function () {
                            $scope.busy = false;

                            if(!allAnswersLoaded) {
                                fetchAnswers();
                            }
                        });
                }
            };

        fetchAnswers();
    });

'use strict';

angular.module('app')
    .controller('rgiQuestionRawListCtrl', function (_, $scope, rgiQuestionRawSrvc) {
        $scope.busy = false;
        $scope.questions = [];
        $scope.portionSize = 100;

        var currentPage = 0, allItemsLoaded = false,
            addQuestions = function(questions) {
                if(!questions.reason) {
                    $scope.questions = $scope.questions.concat(questions.data);
                    $scope.questionListHeader = questions.header;
                    currentPage++;
                }
            };

        rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.portionSize}, addQuestions);

        $scope.loadMore = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allItemsLoaded) {
                rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.portionSize}).$promise
                    .then(function (questions) {
                        addQuestions(questions);

                        if (!questions.reason && (questions.data.length < $scope.portionSize)) {
                            allItemsLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

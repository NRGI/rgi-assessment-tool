'use strict';

angular.module('app')
    .controller('rgiQuestionRawListCtrl', ['_', '$scope', 'rgiQuestionRawSrvc', function (_, $scope, rgiQuestionRawSrvc) {
        $scope.busy = false;
        $scope.questions = [];
        $scope.questionListHeader = [];

        var portionSize = 100, currentPage = 0, allItemsLoaded = false,
            addQuestions = function(questions) {
                if(!questions.reason) {
                    $scope.questions = $scope.questions.concat(questions.data);
                    $scope.questionListHeader = _.uniq($scope.questionListHeader.concat(questions.header));

                    ['last_modified_modified_by', 'last_modified_modified_date'].forEach(function(field) {
                        if($scope.questionListHeader.indexOf(field) !== -1) {
                            $scope.questionListHeader.splice($scope.questionListHeader.indexOf(field), 1);
                            $scope.questionListHeader.push(field);
                        }
                    });

                    currentPage++;
                }
            },
            fetchQuestions = function () {
                if ($scope.busy) {
                    return;
                }

                $scope.busy = true;

                if(!allItemsLoaded) {
                    rgiQuestionRawSrvc.query({skip: currentPage, limit: portionSize}).$promise
                        .then(function (questions) {
                            addQuestions(questions);
                            allItemsLoaded = !questions.reason && (questions.data.length < portionSize);
                        }).finally(function () {
                            $scope.busy = false;

                            if(!allItemsLoaded) {
                                fetchQuestions();
                            }
                        });
                }
            };

        fetchQuestions();
    }]);

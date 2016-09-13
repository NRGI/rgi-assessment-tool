'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', function (
        _,
        $scope,
        rgiAnswerRawSrvc,
        rgiCountrySrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        $scope.busy = false;
        $scope.answers = [];
        $scope.query = {country: ''};

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
                    var query = {skip: currentPage, limit: portionSize};

                    if($scope.query.country) {
                        query.country = $scope.query.country.iso2;
                    }

                    rgiAnswerRawSrvc.query(query).$promise
                        .then(function (answers) {
                            if((!$scope.query.country && !answers.country) || (answers.country === $scope.query.country.iso2)) {
                                addAnswers(answers);

                                if (!answers.reason && (answers.data.length < portionSize)) {
                                    allAnswersLoaded = true;
                                }
                            }
                        }).finally(function () {
                            $scope.busy = false;

                            if(!allAnswersLoaded) {
                                fetchAnswers();
                            }
                        });
                }
            };

        $scope.$watch('query.country', function() {
            portionSize = 100;
            currentPage = 0;
            allAnswersLoaded = false;

            $scope.busy = false;
            $scope.answers = [];
            fetchAnswers();
        });

        rgiCountrySrvc.query({country_use: true}, function(countries) {
            countries.sort(function(countryA, countryB) {
                return countryA.country > countryB.country;
            });

            $scope.countries = countries;
            fetchAnswers();
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load country data failure'));
    });

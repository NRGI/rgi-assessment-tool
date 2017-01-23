'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', ['_', '$scope', 'rgiAnswerRawSrvc', 'rgiCountrySrvc', 'rgiHttpResponseProcessorSrvc', function (
        _,
        $scope,
        rgiAnswerRawSrvc,
        rgiCountrySrvc,
        rgiHttpResponseProcessorSrvc
    ) {
        $scope.busy = false;
        $scope.answers = [];
        $scope.query = {country: ''};
        $scope.answersHeader = [];

        var portionSize = 100, currentPage = 0, allAnswersLoaded = false,
            addAnswers = function(answers) {
                if(!answers.reason) {
                    $scope.answers = $scope.answers.concat(answers.data);
                    $scope.answersHeader = _.uniq($scope.answersHeader.concat(answers.header));
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

                                    var answersHeader = [];

                                    $scope.answersHeader.forEach(function(fieldName) {
                                        if((fieldName.indexOf('comment') !== 0) && (fieldName.indexOf('flag') !== 0)) {
                                            answersHeader.push(fieldName);
                                        }
                                    });

                                    $scope.answersHeader.forEach(function(fieldName) {
                                        if(fieldName.indexOf('comment') === 0) {
                                            answersHeader.push(fieldName);
                                        }
                                    });

                                    $scope.answersHeader.forEach(function(fieldName) {
                                        if(fieldName.indexOf('flag') === 0) {
                                            answersHeader.push(fieldName);
                                        }
                                    });

                                    $scope.answersHeader = answersHeader;
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
    }]);

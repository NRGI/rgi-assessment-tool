'use strict';

angular.module('app')
    .controller('rgiNewAssessmentDialogCtrl', ['$scope', '$route', '$rootScope', '$location', 'rgiAnswerMethodSrvc', 'rgiAssessmentMethodSrvc', 'rgiAssessmentSrvc', 'rgiCountrySrvc', 'rgiHttpResponseProcessorSrvc', 'rgiIdentitySrvc', 'MINERAL_TAGS_SET', 'rgiNotifier', 'rgiQuestionMethodSrvc', 'rgiQuestionSrvc', 'rgiUtilsSrvc', function (
        $scope,
        $route,
        $rootScope,
        $location,
        rgiAnswerMethodSrvc,
        rgiAssessmentMethodSrvc,
        rgiAssessmentSrvc,
        rgiCountrySrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        MINERAL_TAGS_SET,
        rgiNotifier,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc,
        rgiUtilsSrvc
    ) {
        rgiCountrySrvc.query({country_use: true}, function(countries) {
            countries.sort(function(countryA, countryB) {
                return countryA.country > countryB.country;
            });

            $scope.countries = countries;
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load country data failure'));

        $scope.disable_button = false;
        //TODO
        //rgiCountrySrvc.query({}, function (countries) {
        //    var country_values = {},
        //        country_selector = [];
        //
        //    countries.forEach(function (el) {
        //        var add_obj = {value: el.iso2, name: el.country};
        //        country_values[el.iso2] = el;
        //        country_values[el.iso2].index = country_selector.length;
        //        country_selector.push(add_obj);
        //    });
        //    $scope.country_values = country_values;
        //    $scope.country_selector = country_selector;
        //});

        $scope.new_assessment = {
            year: $scope.year ? parseInt($scope.year) : '',
            version: $scope.version || '',
            assessment_countries: [{}]
        };

        var currentYear = new Date().getFullYear();
        $scope.years = [];

        for (var yearIncrement = 0; yearIncrement < 6; yearIncrement++) {
            $scope.years.push(currentYear + yearIncrement);
        }
        // TODO remove country from countries scope when added to new assessments
        $scope.addCountry = function () {
            $scope.new_assessment.assessment_countries.push({country: ''});
        };

        $scope.getAvailableMinerals = function() {
            return MINERAL_TAGS_SET;
        };

        $scope.deleteCountry = function (index) {
            $scope.new_assessment.assessment_countries.splice(index, 1);
        };

        $scope.deployAssessment = function () {
            if($scope.new_assessment.year === undefined) {
                return rgiNotifier.error('Please, select the assessment year');
            } else if($scope.new_assessment.version === undefined) {
                return rgiNotifier.error('Please, select the assessment version');
            } else if(($scope.new_assessment.version === 'mining') && ($scope.new_assessment.mineral === undefined)) {
                return rgiNotifier.error('Please, select the assessment mineral');
            }

            var countrySelected = true;

            $scope.new_assessment.assessment_countries.forEach(function(countryData) {
                if(!countryData.country) {
                    countrySelected = false;
                }
            });

            if(!countrySelected) {
                return rgiNotifier.error('Please, select the assessment country');
            }

            var new_assessment_ID, new_answer_set,
                new_assessment_set = [],
                new_assessment_year = String($scope.new_assessment.year),
                new_assessment_ver = $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                timestamp = new Date().toISOString();

            $scope.disable_button = true;

            rgiAssessmentSrvc.query({year: new_assessment_year, version: $scope.new_assessment.version}, function (assessments) {
                var country_deployed = {value: false};

                assessments.forEach(function (assessment) {
                    $scope.new_assessment.assessment_countries.forEach(function(country) {
                        if((country.country.country === assessment.country) && !assessment.deleted) {
                            country_deployed.value = true;
                            country_deployed.country = assessment.country;
                        }
                    });
                });

                if (country_deployed.value) {
                    rgiNotifier.error(country_deployed.country + ' assessment already deployed');
                    $scope.disable_button = false;
                } else {
                    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
                        $scope.new_assessment.assessment_countries.forEach(function (assessment_country) {
                            new_answer_set = [];
                            new_assessment_ID = assessment_country.country.iso2 + "-" + new_assessment_year + "-" + new_assessment_ver;

                            questions.forEach(function (question) {
                                if (question.assessments.indexOf(new_assessment_ID) < 0) {
                                    question.assessments.push(new_assessment_ID);
                                }
                            });

                            new_assessment_set.push({
                                assessment_ID: new_assessment_ID,
                                ISO3: assessment_country.country.country_ID,
                                year: $scope.new_assessment.year,
                                version: $scope.new_assessment.version,
                                mineral: $scope.new_assessment.mineral,
                                country: assessment_country.country.country,
                                created: {
                                    created_by: rgiIdentitySrvc.currentUser._id,
                                    created_date: timestamp}
                            });


                            questions.forEach(function (q) {
                                new_answer_set.push({
                                    answer_ID: new_assessment_ID + '-' + String(rgiUtilsSrvc.zeroFill(q.question_order, 3)),
                                    question_ID: q._id,
                                    question_trial: q.question_trial,
                                    assessment_ID: new_assessment_ID,
                                    year: new_assessment_year,
                                    version: new_assessment_ver,
                                    question_order: q.question_order,
                                    question_v: q.question_v + 1,
                                    last_modified: {modified_by: rgiIdentitySrvc.currentUser._id}
                                });
                            });
                            rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set)
                                .then(function () {
                                }, function (reason) {rgiNotifier.error(reason);}
                            );
                        });

                        //send to mongo
                        rgiAssessmentMethodSrvc.createAssessment(new_assessment_set)
                            .then(rgiQuestionMethodSrvc.updateQuestionSet(questions))
                            .then(function () {
                                rgiNotifier.notify('Assessment deployed!');
                                $scope.closeThisDialog();
                                $route.reload();
                                $location.path('admin/assessment-admin');
                            }, function (reason) {
                                rgiNotifier.error(reason);
                            });
                    }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load question data failure'));
                }
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load assessment data failure'));
        };
    }]);

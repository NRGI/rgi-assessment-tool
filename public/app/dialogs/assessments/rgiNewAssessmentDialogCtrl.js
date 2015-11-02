'use strict';

angular
    .module('app')
    .controller('rgiNewAssessmentDialogCtrl', function (
        $scope,
        $route,
        $location,
        rgiNotifier,
        ngDialog,
        rgiAssessmentMethodSrvc,
        rgiQuestionSrvc,
        rgiQuestionMethodSrvc,
        rgiCountrySrvc
    ) {
        $scope.countries = rgiCountrySrvc.query({country_use: true});
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
            year: "",
            version: "",
            assessment_countries: [{}]
        };

        var cur_year = new Date().getFullYear(),
            years = [],
            i;

        for (i = 0; i < 6; i += 1) {
            years.push(cur_year + i);
        }

        $scope.years = years;

        $scope.closeDialog = function () {
            ngDialog.close();
        };
        // TODO remove country from countries scope when added to new assessments
        $scope.countryAdd = function (country_pop) {
            $scope.new_assessment.assessment_countries.push({country: ""});
            //var country_id = $scope.new_assessment.assessment_countries[$scope.new_assessment.assessment_countries.length - 2].country.iso2,
            //    country_array = $scope.countries;
            //
            //for (var i = 0; i < country_array.length; i++) {
            //    console.log(country_array[i].iso2);
            ////    //if(country_array[i].iso2 == country_id) {
            ////    //    country_array.splice(i, 1);
            ////    //    break;
            ////    //}
            //}
        };

        $scope.countryDelete = function (index) {
            $scope.new_assessment.assessment_countries.splice(index, 1);
        };
        $scope.assessmentDeploy = function () {
            var new_assessment_data = [],
                new_question_data = [];
            rgiQuestionSrvc.query({assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase()}, function (d) {
                if (d.length > 0) {
                    rgiNotifier.error('Assessment already deployed');
                } else {
                    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (base_questions) {

                        $scope.new_assessment.assessment_countries.forEach(function (assessment_country) {
                            new_assessment_data.push({
                                assessment_ID: assessment_country.country.iso2 + "-" + String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                                ISO3: assessment_country.country.country_ID,
                                year: $scope.new_assessment.year,
                                version: $scope.new_assessment.version,
                                country: assessment_country.country.country
                            });
                        });

                        base_questions.forEach(function (question) {
                            new_question_data.push({
                                year: String($scope.new_assessment.year),
                                version: $scope.new_assessment.version,
                                root_question_ID: question._id,
                                assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                                question_use: question.question_use,
                                question_order: question.question_order,
                                question_label: question.question_label,
                                qid: question.qid,
                                precept: question.precept,
                                component: question.component,
                                component_text: question.component_text,
                                indicator: question.indicator,
                                dejure: question.dejure,
                                question_text: question.question_text,
                                question_criteria: question.question_criteria,
                                question_dependancies: question.question_dependancies,
                                question_guidance_text: question.question_guidance_text,
                                mapping_2013: question.mapping_2013,
                                mapping_external: question.mapping_external
                            });
                        });

                        // send to mongo
                        rgiAssessmentMethodSrvc.createAssessment(new_assessment_data)
                            .then(rgiQuestionMethodSrvc.insertQuestionSet(new_question_data))
                            .then(function () {
                                rgiNotifier.notify('Assessment deployed!');
                                $scope.closeThisDialog();
                                $route.reload();
                                $location.path('admin/assessment-admin');
                            }, function (reason) {
                                rgiNotifier.error(reason);
                            });
                    });
                }
            });
        };
    });
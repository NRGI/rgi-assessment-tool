'use strict';

angular
    .module('app')
    .controller('rgiNewAssessmentDialogCtrl', function (
        $scope,
        $route,
        $location,
        rgiNotifier,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiAssessmentMethodSrvc,
        rgiAssessmentSrvc,
        rgiCountrySrvc,
        rgiIdentitySrvc,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc,
        rgiUtilsSrvc
    ) {
        var current_user = rgiIdentitySrvc.currentUser;
        $scope.countries = rgiCountrySrvc.query({country_use: true});
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
            var new_assessment_ID, new_answer_set,
                new_assessment_set = [],
                new_assessment_year = String($scope.new_assessment.year),
                new_assessment_ver = $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                timestamp = new Date().toISOString();

            $scope.disable_button = true;

            rgiQuestionSrvc.query({assessments: new_assessment_year + "-" + new_assessment_ver}, function (d) {
                if (d.length > 0) {
                    rgiNotifier.error('Assessment already deployed');
                } else {
                    rgiQuestionSrvc.query({}, function (questions) {
                        questions.forEach(function (question) {
                            question.assessments.push(new_assessment_year + "-" + new_assessment_ver);
                        });

                        $scope.new_assessment.assessment_countries.forEach(function (assessment_country) {
                            new_answer_set = [];
                            console.log(new_answer_set);

                            new_assessment_ID = assessment_country.country.iso2 + "-" + new_assessment_year + "-" + new_assessment_ver;

                            new_assessment_set.push({
                                assessment_ID: new_assessment_ID,
                                ISO3: assessment_country.country.country_ID,
                                year: $scope.new_assessment.year,
                                version: $scope.new_assessment.version,
                                country: assessment_country.country.country,
                                created: {
                                    created_by: current_user._id,
                                    created_date: timestamp}
                            });

                            questions.forEach(function (q) {
                                new_answer_set.push({
                                    answer_ID: new_assessment_ID + '-' + String(rgiUtilsSrvc.zeroFill(q.question_order, 3)),
                                    question_ID: q._id,
                                    assessment_ID: new_assessment_ID,
                                    year: new_assessment_year,
                                    version: new_assessment_ver,
                                    question_order: q.question_order,
                                    question_v: q.question_v + 1,
                                    last_modified: {modified_by: current_user._id}
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
                    });
                }
            });
        };
    });
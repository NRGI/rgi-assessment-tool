'use strict';
//var angular;
/*jslint unparam: true nomen: true*/

angular.module('app').controller('rgiNewAssessmentDialogCtrl', function ($scope, $route, rgiNotifier, ngDialog, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiQuestionMethodSrvc, rgiCountrySrvc) {

    $scope.countries = rgiCountrySrvc.query();
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
        //function removeFunction (myObjects,prop,valu) {
        //    return myObjects.filter(function (val) {
        //        return val[prop] !== valu;
        //    });
        //
        //}
        $scope.new_assessment.assessment_countries.push({country: ""});
        //$scope.countries = removeFunction($scope.countries, "country", country_pop.country);

    };

    $scope.countryDelete = function (index) {
        $scope.new_assessment.assessment_countries.splice(index, 1);
    };
    $scope.assessmentDeploy = function () {
        var newAssessmentData = [],
            newQuestionData = [];
        rgiQuestionSrvc.query({assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase()}, function (d) {
            if (d.length > 0) {
                rgiNotifier.error('Assessment already deployed');
            } else {
                rgiQuestionSrvc.query({assessment_ID: 'base'}, function (data) {

                    $scope.new_assessment.assessment_countries.forEach(function (el) {
                        newAssessmentData.push({
                            assessment_ID: el.country.iso2 + "-" + String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                            ISO3: el.country.country_ID,
                            year: $scope.new_assessment.year,
                            version: $scope.new_assessment.version,
                            country: el.country.country,
                            questions_unfinalized: data.length,
                            question_length: data.length
                        });
                    });

                    data.forEach(function (el) {
                        newQuestionData.push({
                            root_question_ID: el._id,
                            year: String($scope.new_assessment.year),
                            version: $scope.new_assessment.version,
                            assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
                            component: el.component,
                            component_text: el.component_text,
                            indicator: el.indicator,
                            sub_indicator_name: el.sub_indicator_name,
                            precept: el.precept,
                            // old_reference: el.old_reference,
                            question_order: el.question_order,
                            question_choices: el.question_choices,
                            question_text: el.question_text,
                            section_name: el.section_name
                        });
                    });

                    // send to mongo
                    rgiAssessmentMethodSrvc.createAssessment(newAssessmentData)
                        .then(rgiQuestionMethodSrvc.insertQuestionSet(newQuestionData))
                        .then(function () {
                            rgiNotifier.notify('Assessment deployed!');
                            $scope.closeThisDialog();
                            $route.reload();
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                });
            }
        });
    };
});

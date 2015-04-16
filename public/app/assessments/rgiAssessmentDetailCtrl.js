'use strict';
var angular;
/*jslint nomen: true regexp: true*/

angular.module('app').controller('rgiAssessmentDetailCtrl', function ($scope, $routeParams, $location, rgiNotifier, rgiIdentitySrvc, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiAssessmentMethodSrvc, rgiAnswerMethodSrvc) {
    // filtering options
    $scope.sortOptions = [
        {value: "question_order", text: "Sort by Question Number"},
        {value: "component_id", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.identity = rgiIdentitySrvc;

    rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment_data) {
        $scope.assessment = assessment_data;
        $scope.assessment.reviewer = rgiUserListSrvc.get({_id: assessment_data.reviewer_ID});
        $scope.assessment.researcher = rgiUserListSrvc.get({_id: assessment_data.researcher_ID});
        $scope.answers = rgiAnswerSrvc.query({assessment_ID: assessment_data.assessment_ID});
    });

    $scope.assessmentStart = function (assessment) {

        var new_assessment_data = new rgiAssessmentSrvc(assessment);

        new_assessment_data.status = 'started';
        new_assessment_data.start_date = {started_by: rgiIdentitySrvc.currentUser._id};

        rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data).then(function () {
            $location.path('/assessments/assessment-edit/' + new_assessment_data.assessment_ID + '-' + '001');
            rgiNotifier.notify('Assessment started!');
        }, function (reason) {
            rgiNotifier.error(reason);
        });
    };

    $scope.assessmentSubmit = function () {
        var new_assessment_data = new rgiAssessmentSrvc($scope.assessment);

        new_assessment_data.status = 'submitted';
        new_assessment_data.questions_complete = 0;

        rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
            .then(function () {
                $location.path('/assessments');
                rgiNotifier.notify('Assessment submitted!');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
    };
});

// Angular capitilaize filter
angular.module('app').filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) :  '';
    };
});
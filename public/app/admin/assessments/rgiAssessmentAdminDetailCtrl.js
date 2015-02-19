angular.module('app').controller('rgiAssessmentAdminDetailCtrl', function ($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, $routeParams) {
    // filtering options
    $scope.sort_options = [
        {value: "question_order", text: "Sort by Question Number"},
        {value: "component_id", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}
    ];
    $scope.sortOrder = $scope.sort_options[0].value;

    // pull assessment data and add
    rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (data) {
        data.reviewer = rgiUserListSrvc.get({_id: data.reviewer_ID});
        data.researcher = rgiUserListSrvc.get({_id: data.researcher_ID});
        data.assigned_by = rgiUserListSrvc.get({_id: data.assignment.assigned_by});
        data.edited_by = rgiUserListSrvc.get({_id: data.modified[data.modified.length - 1].modified_by});
        data.question_list = rgiAnswerSrvc.query({assessment_ID: data.assessment_ID});

        $scope.assessment = data;

    });
});

// Angular capitilaize filter
angular.module('app').filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) :  '';
    };
});
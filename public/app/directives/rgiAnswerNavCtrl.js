
function zeroFill(number, width) {
    'use strict';
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}
angular.module('app').controller('rgiAnswerNavCtrl', function ($scope, $location, $routeParams, rgiIdentitySrvc) {
    'use strict';
    var root_url, answer_split;
    $scope.current_user = rgiIdentitySrvc.currentUser;

    if ($scope.current_user === 'supervisor') {
        root_url = '/admin/assessments-admin/answer/';
    } else {
        root_url = '/assessments/assessment/answer/';
    }

    answer_split = $routeParams.answer_ID.split('-');
    $scope.assessment_ID = answer_split.slice(0, answer_split.length - 1).join('-');
    $scope.question_number = Number(answer_split[3]);
    //$scope.question_number = Number(answer_split[3]);
    console.log($scope);

    $scope.moveForward = function () {
        $location.path(root_url + $scope.assessment_ID + "-" + String(zeroFill($scope.question_number + 1, 3)));
    };
    $scope.fastForward = function () {
        $location.path(root_url + $scope.assessment_ID + "-" + String(zeroFill($scope.assessment.question_length, 3)))
    };
    $scope.moveBackward = function () {
        $location.path(root_url + $scope.assessment_ID + "-" + String(zeroFill($scope.question_number - 1, 3)));
    };
    $scope.fastBackward = function () {
        $location.path(root_url + $scope.assessment_ID + "-001");
    };

});
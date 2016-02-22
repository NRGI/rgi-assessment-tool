'use strict';

angular
    .module('app')
    .controller('rgiAnswerNavCtrl', function (
        $scope,
        $location,
        $routeParams,
        rgiUtilsSrvc,
        rgiIdentitySrvc,
        rgiAnswerSrvc
    ) {
        var root_url, answer_length,
            answer_split = $routeParams.answer_ID.split('-'),
            assessment_ID = answer_split.slice(0, answer_split.length - 1).join('-');

        $scope.answer_number = Number(answer_split[3]);
        $scope.current_user = $scope.$root.current_user;

        if ($scope.current_user === 'supervisor') {
            root_url = '/admin/assessments-admin/answer/';
        } else {
            root_url = '/assessments/answer/';
        }
        rgiAnswerSrvc.query({assessment_ID: assessment_ID}, function (answers) {
            $scope.answers_length = answers.length;
        });

        $scope.moveForward = function () {
            $location.path(root_url + assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill($scope.answer_number + 1, 3)));
        };
        $scope.fastForward = function () {
            $location.path(root_url + assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill($scope.answers_length, 3)));
        };
        $scope.moveBackward = function () {
            $location.path(root_url + assessment_ID + "-" + String(rgiUtilsSrvc.zeroFill($scope.answer_number - 1, 3)));
        };
        $scope.fastBackward = function () {
            $location.path(root_url + assessment_ID + "-001");
        };

    });
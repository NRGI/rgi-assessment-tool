'use strict';

angular
    .module('app')
    .controller('rgiAnswerRawListTableCtrl', function (
        _,
        $scope,
        rgiAnswerRawSrvc
    ){

        // var limit = 50,
        //     currentPage = 0,
        //     totalPages = 0;
        //
        // $scope.busy = false;
        //
        // rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (response) {
        //     console.log(response);
        //     $scope.count = response.count;
        //     $scope.answers = response.raw_answer_array;
        //     $scope.raw_answer_header = response.raw_answer_header;
        //     $scope.raw_answer_array = response.raw_answer_array;
        //     totalPages = Math.ceil(response.count / limit);
        //     currentPage = currentPage + 1;
        // });
        //
        // $scope.loadMoreAnswers = function () {
        //     if ($scope.busy) {
        //         return;
        //     }
        //     $scope.busy = true;
        //
        //     if(currentPage < totalPages) {
        //         rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (response) {
        //             $scope.answers = _.union($scope.answers, response.raw_answer_array);
        //             $scope.raw_answer_array = _.union($scope.raw_answer_array, response.raw_answer_array);
        //             currentPage = currentPage + 1;
        //             $scope.busy = false;
        //         });
        //     }
        // };
    });
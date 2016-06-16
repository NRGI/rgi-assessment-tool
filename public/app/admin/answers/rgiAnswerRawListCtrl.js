'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', function (
        _,
        $scope,
        rgiIdentitySrvc,
        rgiAnswerRawSrvc
    ) {

        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.sort_options = [
            {value: 'assessment_ID', text: 'Sort by assessment'},
            {value: 'answer_ID', text: 'Sort by answer id'},
            {value: 'status', text: 'Sort by Status'},
            {value: 'researcher_score.letter', text: 'Researcher letter score'},
            {value: 'researcher_score.text', text: 'Researcher score text'},
            {value: 'researcher_score.value', text: 'Researcher score value'},
            {value: 'reviewer_score.letter', text: 'Reviewer letter score'},
            {value: 'reviewer_score.text', text: 'Reviewer score text'},
            {value: 'reviewer_score.value', text: 'Reviewer score value'}
        ];
        $scope.sort_order = $scope.sort_options[0].value;
        var limit = 50,
            currentPage = 0,
            totalPages = 0;

        $scope.busy = false;

        rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (response) {
            console.log(response);
            $scope.count = response.count;
            $scope.answers = response.raw_answer_array;
            $scope.raw_answer_header = response.raw_answer_header;
            $scope.raw_answer_array = response.raw_answer_array;
            totalPages = Math.ceil(response.count / limit);
            currentPage = currentPage + 1;
        });

        $scope.loadMoreAnswers = function () {
            if ($scope.busy) {
                return;
            }
            $scope.busy = true;

            if(currentPage < totalPages) {
                rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (response) {
                    $scope.answers = _.union($scope.answers, response.raw_answer_array);
                    $scope.raw_answer_array = _.union($scope.raw_answer_array, response.raw_answer_array);
                    currentPage = currentPage + 1;
                    $scope.busy = false;
                });
            }
        };
        
    });
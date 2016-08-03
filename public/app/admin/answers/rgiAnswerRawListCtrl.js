'use strict';

angular.module('app')
    .controller('rgiAnswerRawListCtrl', function (
        _,
        $scope,
        rgiAnswerRawSrvc
    ) {
        $scope.sort_options = [
            {value: 'assessment_ID', text: 'Sort by assessment'},
            {value: 'answer_ID', text: 'Sort by answer id'},
            {value: 'status', text: 'Sort by Status'},
            {value: 'researcher_score_letter', text: 'Researcher letter score'},
            {value: 'researcher_score_text', text: 'Researcher score text'},
            {value: 'researcher_score_value', text: 'Researcher score value'},
            {value: 'reviewer_score_letter', text: 'Reviewer letter score'},
            {value: 'reviewer_score_text', text: 'Reviewer score text'},
            {value: 'reviewer_score_value', text: 'Reviewer score value'}
        ];

        $scope.sort_order = $scope.sort_options[0].value;
        $scope.busy = false;
        var limit = 50, currentPage = 0, totalPages = 0;

        rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (response) {
            $scope.count = response.count;
            $scope.answers = response.raw_answer_array;
            $scope.raw_answer_header = response.raw_answer_header;
            $scope.raw_answer_array = response.raw_answer_array;
            totalPages = Math.ceil(response.count / limit);
            currentPage++;
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
                    currentPage++;
                }).finally(function() {
                    $scope.busy = false;
                });
            }
        };
        
    });

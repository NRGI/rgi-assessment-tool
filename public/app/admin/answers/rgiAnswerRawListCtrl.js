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

        $scope.raw_answer_header = [
            'assessment_id',
            'answer_id',
            'status',
            'question_text',
            'researcher_score_letter',
            'researcher_score_text',
            'researcher_score_value',
            'reviewer_score_letter',
            'reviewer_score_text',
            'reviewer_score_value'
        ];

        $scope.sort_order = $scope.sort_options[0].value;
        $scope.busy = false;
        $scope.answers = [];
        $scope.raw_answer_array = [];
        var limit = 50, currentPage = 0, allAnswersLoaded = false;

        rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, function (answers) {
            if(!answers.reason) {
                $scope.answers = answers;
                $scope.raw_answer_array = answers;
                currentPage++;
            }
        });

        $scope.loadMoreAnswers = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allAnswersLoaded) {
                rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}).$promise
                    .then(function (answers) {
                        if(!answers.reason) {
                            $scope.answers = $scope.answers.concat(answers);
                            $scope.raw_answer_array = $scope.raw_answer_array.concat(answers);
                            currentPage++;

                            if (answers.length < limit) {
                                allAnswersLoaded = true;
                            }
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

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

        var limit = 50, currentPage = 0, allAnswersLoaded = false,
            addAnswers = function(answers) {
                if(!answers.reason) {
                    $scope.answers = $scope.answers.concat(answers);
                    currentPage++;
                }
            },
            expandScore = function(outputAnswer, inputAnswer, scoreType) {
                if(inputAnswer[scoreType + '_score']) {
                    ['letter', 'text', 'value'].forEach(function(field) {
                        outputAnswer[scoreType + '_score_' + field] = inputAnswer[scoreType + '_score'][field];
                    });
                }
            };

        rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, addAnswers);

        $scope.getExportedAnswersData = function() {
            var answers = [];

            $scope.answers.forEach(function(answerData) {
                var answer = {};

                ['assessment_ID', 'answer_ID', 'status'].forEach(function(field) {
                    answer[field.toLowerCase()] = answerData[field];
                });

                answer.question_text = answerData.question_ID.question_text;
                expandScore(answer, answerData, 'researcher');
                expandScore(answer, answerData, 'reviewer');

                answers.push(answer);
            });

            return answers;
        };

        $scope.loadMoreAnswers = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allAnswersLoaded) {
                rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}).$promise
                    .then(function (answers) {
                        addAnswers(answers);

                        if (!answers.reason && (answers.length < limit)) {
                            allAnswersLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

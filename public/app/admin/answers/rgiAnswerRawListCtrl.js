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
            'answer_ID',
            'question_order',
            'question_text',
            'status',
            'researcher_score_letter',
            'researcher_score_justification',
            'reviewer_score_letter',
            'reviewer_score_justification',
            'final_score_letter',
            'external_answer_letter',
            'external_justification',
            'external_comment',
            'Researcher score 1',
            'Time stamp score 1',
            'Researcher score 2',
            'Time stamp score 2',
            'reviewer_score_history_date',
            'reviewer_score_history_order',
            'reviewer_score_history_score_letter',
            'reviewer_score_history_justification'
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
            copyScore = function(outputAnswer, inputAnswer, scoreType) {
                var field = scoreType + '_score';
                outputAnswer[field + '_letter'] = inputAnswer[field] ? inputAnswer[field].letter : '';
            },
            copyScoreWithJustification = function(outputAnswer, inputAnswer, scoreType) {
                outputAnswer[scoreType + '_justification'] = inputAnswer[scoreType + '_justification'];
                copyScore(outputAnswer, inputAnswer, scoreType);
            },
            copyScoreHistory = function(outputAnswer, inputAnswer, scoreType) {
                var prefix = scoreType + '_score_history';

                if(inputAnswer[prefix].length > 0) {
                    var scoreHistory = inputAnswer[prefix][inputAnswer[prefix].length - 1];
                    outputAnswer[prefix + '_date'] = scoreHistory.date;
                    outputAnswer[prefix + '_order'] = scoreHistory.order;

                    if(scoreHistory.score) {
                        outputAnswer[prefix + '_score_letter'] = scoreHistory.score.letter;
                    }

                    outputAnswer[prefix + '_justification'] = scoreHistory.justification;
                } else {
                    ['date', 'order', 'score_letter', 'justification'].forEach(function(field) {
                        outputAnswer[prefix + '_' + field] = '';
                    });
                }
            },
            copyResearcherScoreHistory = function(outputAnswer, researcherScoreHistory, index) {
                if(researcherScoreHistory.length >= index) {
                    var historyRecord = researcherScoreHistory[researcherScoreHistory.length - index];
                    outputAnswer['Researcher score ' + index] = historyRecord.score ? historyRecord.score.letter : '';
                    outputAnswer['Time stamp score ' + index] = historyRecord.date;
                }
            };

        rgiAnswerRawSrvc.query({skip: currentPage, limit: limit}, addAnswers);

        $scope.getExportedAnswersData = function() {
            var answers = [];

            $scope.answers.forEach(function(answerData) {
                var answer = {};

                answer.answer_ID = answerData.answer_ID;
                answer.question_order = answerData.question_order;
                answer.question_text = answerData.question_ID.question_text;
                answer.status = answerData.status;

                copyScoreWithJustification(answer, answerData, 'researcher');
                copyScoreWithJustification(answer, answerData, 'reviewer');
                copyScore(answer, answerData, 'final');

                var externalAnswer;

                if(answerData.external_answer.length > 0) {
                    externalAnswer = answerData.external_answer[answerData.external_answer.length - 1];
                } else {
                    externalAnswer = {comment: '', justification: '', score: {letter: ''}};
                }

                answer.external_answer_letter = externalAnswer.score.letter;
                answer.external_justification = externalAnswer.justification;
                answer.external_comment = externalAnswer.comment;

                copyResearcherScoreHistory(answer, answerData.researcher_score_history, 1);
                copyResearcherScoreHistory(answer, answerData.researcher_score_history, 2);
                copyScoreHistory(answer, answerData, 'reviewer');
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

'use strict';

angular.module('app')
    .controller('rgiQuestionRawListCtrl', function (
        _,
        $scope,
        rgiQuestionRawSrvc
    ) {
        $scope.questionListHeader = [
            'question_order',
            'question_v',
            'question_text',
            'question_criteria_letter',
            'question_criteria_text',
            'last_modified_modified_by',
            'last_modified_modified_date'
        ];

        $scope.busy = false;
        $scope.questions = [];
        $scope.itemsPerPage = 50;

        var currentPage = 0, allItemsLoaded = false,
            addQuestions = function(questions) {
                if(!questions.reason) {
                    $scope.questions = $scope.questions.concat(questions);
                    currentPage++;
                }
            },
            getCriteriaFieldSet = function(question, field) {
                var values = [];

                question.question_criteria.forEach(function(criterion) {
                    values.push(criterion[field]);
                });

                return JSON.stringify(values).split('"').join('\'');
            };

        rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.itemsPerPage}, addQuestions);

        $scope.getExportedData = function() {
            var questions = [];

            $scope.questions.forEach(function(questionData) {
                var question = {}, lastModified = questionData.last_modified, lastModifiedBy = lastModified.modified_by;

                ['question_order', 'question_v', 'question_text'].forEach(function(field) {
                    question[field] = questionData[field];
                });

                ['letter', 'text'].forEach(function(field) {
                    question['question_criteria_' + field] = getCriteriaFieldSet(questionData, field);
                });

                if(lastModifiedBy.firstName && lastModifiedBy.lastName) {
                    question.last_modified_modified_by = lastModifiedBy.firstName + ' ' + lastModifiedBy.lastName +
                        (lastModifiedBy.email ? ' (' + lastModifiedBy.email + ')' : '');
                } else {
                    question.last_modified_modified_by = lastModifiedBy.email;
                }

                question.last_modified_modified_date = lastModified.modified_date;
                questions.push(question);
            });

            return questions;
        };

        $scope.loadMore = function () {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(!allItemsLoaded) {
                rgiQuestionRawSrvc.query({skip: currentPage, limit: $scope.itemsPerPage}).$promise
                    .then(function (questions) {
                        addQuestions(questions);

                        if (!questions.reason && (questions.length < $scope.itemsPerPage)) {
                            allItemsLoaded = true;
                        }
                    }).finally(function () {
                        $scope.busy = false;
                    });
            }
        };
    });

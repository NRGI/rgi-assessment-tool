'use strict';

angular.module('app')
    .controller('rgiQuestionAdminCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiPreceptGuideSrvc,
        rgiQuestionSrvc
    ) {
        // filtering options
        $scope.sort_options = [
            {value: "question_order", text: "Sort by Question Order"},
            {value: "component_text", text: "Sort by Component"},
            {value: "question_text", text: "Sort by Question Text"}
        ];
        $scope.sort_order = $scope.sort_options[0].value;
        $scope.order_reverse = true;

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            var q;
            $scope.questions = rgiPreceptGuideSrvc.getQuestionTemplates();
            $scope.getArray = [];

            questions.forEach(function (question) {
                q = {
                    question_order: question.question_order,
                    question_label: question.question_label,
                    precept: question.precept,
                    question_type: question.question_type,
                    question_text: question.question_text,
                    component_text: question.component_text,
                    indicator_name: question.indicator_name,
                    dejure: question.dejure
                };
                question.question_criteria.forEach(function (crit, j) {
                    q['choice_' + String(j)] = crit.name;
                    q['choice_' + String(j) + '_criteria'] = crit.text;
                });
                $scope.getArray.push(q);
                $scope.questions["precept_" + String(question.precept)].section_len += 1;
                $scope.questions["precept_" + String(question.precept)].data.push(question);
            });

            $scope.header = ['Question Order', 'Question Label',  'NRC Prece[t', 'Question Type', 'Question Text', 'Component Text', 'Indicator Name', 'Dejure?'];
        });

        // $scope.questions = rgiQuestionSrvc.query();
        $scope.newQuestionDialog = function () {
            rgiDialogFactory.questionNew($scope);
        };
    });
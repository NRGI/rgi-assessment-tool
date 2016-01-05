angular
    .module('app')
    .controller('rgiQuestionAdminCtrl', function (
        $scope,
        rgiQuestionSrvc,
        rgiDialogFactory,
        ngDialog
    ) {
        'use strict';
        // filtering options
        $scope.sort_options = [
            {value: "question_order", text: "Sort by Question Order"},
            {value: "component_text", text: "Sort by Component"},
            {value: "question_text", text: "Sort by Question Text"}
        ];
        $scope.sort_order = $scope.sort_options[0].value;

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (data) {

            var question;
            $scope.questions = data;
            $scope.getArray = [];

            data.forEach(function (el) {
                question = {
                    question_order: el.question_order,
                    question_text: el.question_text,
                    component_text: el.component_text,
                    indicator_name: el.indicator_name,
                    sub_indicator_name: el.sub_indicator_name,
                    minstry_if_applicable: el.minstry_if_applicable,
                    section_name: el.section_name,
                    child_question: el.child_question,
                    nrc_precept: el.nrc_precept
                };
                el.question_criteria.forEach(function (el_sub, j) {
                    question['choice_' + String(j)] = el_sub.name;
                    question['choice_' + String(j) + '_criteria'] = el_sub.text;
                });
                $scope.getArray.push(question);
            });

            $scope.header = ['Question Order', 'Question Text', 'Component Text', 'Indicator Name', 'Subindicator Name', 'Ministry', 'Section', 'Child Question', 'NRC Precept'];
        });

        // $scope.questions = rgiQuestionSrvc.query();
        $scope.newQuestionDialog = function () {
            rgiDialogFactory.questionNew($scope);
        };
    });
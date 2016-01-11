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
        $scope.order_reverse = true;

        rgiQuestionSrvc.query({assessment_ID: 'base'}, function (questions) {
            var q;
            $scope.questions = {
                precept_1: {
                    label: "Precept 1: Strategy, consultation and institutions",
                    id: "precept_1",
                    order: 1,
                    section_len: 0,
                    data: []
                },
                precept_2: {
                    label: "Precept 2: Accountability and transparency",
                    id: "precept_2",
                    order: 2,
                    section_len: 0,
                    data: []
                },
                precept_3: {
                    label: "Precept 3: Exploration and license allocation",
                    id: "precept_3",
                    order: 3,
                    section_len: 0,
                    data: []
                },
                precept_4: {
                    label: "Precept 4: Taxation",
                    id: "precept_4",
                    order: 4,
                    section_len: 0,
                    data: []
                },
                precept_5: {
                    label: "Precept 5: Local effects",
                    id: "precept_5",
                    order: 5,
                    section_len: 0,
                    data: []
                },
                precept_6: {
                    label: "Precept 6: State-owned enterprise",
                    id: "precept_6",
                    order: 6,
                    section_len: 0,
                    data: []
                },
                precept_7: {
                    label: "Precept 7: Revenue distribution",
                    id: "precept_7",
                    order: 7,
                    section_len: 0,
                    data: []
                },
                precept_8: {
                    label: "Precept 8: Revenue volatility",
                    id: "precept_8",
                    order: 8,
                    section_len: 0,
                    data: []
                },
                precept_9: {
                    label: "Precept 9: Government spending",
                    id: "precept_9",
                    order: 9,
                    section_len: 0,
                    data: []
                },
                precept_10: {
                    label: "Precept 10: Private sector development",
                    id: "precept_10",
                    order: 10,
                    section_len: 0,
                    data: []
                },
                precept_11: {
                    label: "Precept 11: Roles of international companies",
                    id: "precept_11",
                    order: 11,
                    section_len: 0,
                    data: []
                },
                precept_12: {
                    label: "Precept 12: Roles of international actors",
                    id: "precept_12",
                    order: 12,
                    section_len: 0,
                    data: []
                }
            };
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
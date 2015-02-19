angular.module('app').controller('rgiQuestionAdminCtrl', function ($scope, rgiQuestionSrvc, ngDialog) {
    // filtering options
    $scope.sortOptions = [
        {value: "question_order", text: "Sort by Question Order"},
        {value: "component_text", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}
    ];
    $scope.sortOrder = $scope.sortOptions[0].value;
    rgiQuestionSrvc.query(function (data) {
        var i, j;
        $scope.questions = data;
        $scope.getArray = [];

        for (i = data.length - 1; i >= 0; i -= 1) {
            var question = {
                question_order: data[i].question_order,
                component_text: data[i].component_text,
                indicator_name: data[i].indicator_name,
                sub_indicator_name: data[i].sub_indicator_name,
                minstry_if_applicable: data[i].minstry_if_applicable,
                section_name: data[i].section_name,
                child_question: data[i].child_question,
                question_text: data[i].question_text,
                nrc_precept: data[i].nrc_precept
            };
            for (j = data[i].question_choices.length - 1; j >= 0; j -= 1) {
                question['choice_' + String(j)] = data[i].question_choices[j].name;
                question['choice_' + String(j) + '_criteria'] = data[i].question_choices[j].criteria;
            }
            $scope.getArray.push(question);
        }
    });

    // $scope.questions = rgiQuestionSrvc.query();

    $scope.newQuestionDialog = function () {
        ngDialog.open({ template: 'new-question-dialog.html' });
    };
});
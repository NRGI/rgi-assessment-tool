'use strict';
var angular;
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
        $scope.value = true;
        // ngDialog.open({ template: '/partials/admin/questions/test' });
        ngDialog.open({
            template: 'partials/admin/questions/new-question-dialog',
            controller: 'dialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };
});

angular.module('app').controller('dialogCtrl', function ($scope, ngDialog) {
    $scope.question_choices = [{order: 1, criteria: "Enter text"}];
    $scope.dialogModel = {
        message : 'message from passed scope'
    };
    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.questionOptionAdd = function () {
        $scope.question_choices.push({order: $scope.question_choices.length + 1, criteria: "Enter text"});
    };

    $scope.optionDelete = function (index) {
        // $scope.question.question_choices.splice(index, 1);
        // var i;
        // for (i = $scope.question.question_choices.length - 1; i >= 0; i -= 1) {
        //     $scope.question.question_choices[i].order = i + 1;
        // }
    };
    $scope.questionCreate = function () {
        var new_question_data = {
            // firstName: $scope.fname,
            // lastName: $scope.lname,
            // username: $scope.username,
            // email: $scope.email,
            // password: $scope.password,
            // // ADD ROLE IN CREATION EVENT
            // roles: [$scope.roleSelect],
            // address: [$scope.address],
            // language: [$scope.language]
        };

    //     rgiUserMethodSrvc.createUser(newUserData).then(function () {
    //         // rgiMailer.send($scope.email);
    //         rgiNotifier.notify('User account created!' + $scope.email);
    //         $location.path('/admin/user-admin');
    //     }, function (reason) {
    //         rgiNotifier.error(reason);
    //     });
    };
});
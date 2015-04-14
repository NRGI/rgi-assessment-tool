'use strict';
var angular;
/*jslint nomen: true*/

angular.module('app').controller('rgiQuestionAdminCtrl', function ($scope, rgiQuestionSrvc, ngDialog) {
    // filtering options
    $scope.sortOptions = [
        {value: "question_order", text: "Sort by Question Order"},
        {value: "component_text", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}
    ];
    $scope.sortOrder = $scope.sortOptions[0].value;

    rgiQuestionSrvc.query({assessment_ID: 'base'}, function (data) {

        var question;
        $scope.questions = data;
        $scope.getArray = [];

        data.forEach(function (el, i) {
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
            el.question_choices.forEach(function (el_sub, j) {
                question['choice_' + String(j)] = el_sub.name;
                question['choice_' + String(j) + '_criteria'] = el_sub.criteria;
            });
            $scope.getArray.push(question);
        });

        $scope.header = ['Question Order', 'Question Text', 'Component Text', 'Indicator Name', 'Subindicator Name', 'Ministry', 'Section', 'Child Question', 'NRC Precept'];
    });

    // $scope.questions = rgiQuestionSrvc.query();

    $scope.newQuestionDialog = function () {
        $scope.value = true;
        // ngDialog.open({ template: '/partials/admin/questions/test' });
        ngDialog.open({
            template: 'partials/admin/questions/new-question-dialog',
            controller: 'questionDialogCtrl',
            className: 'ngdialog-theme-plain width750',
            scope: $scope
        });
    };
});

angular.module('app').controller('questionDialogCtrl', function ($scope, ngDialog) {

    $scope.new_question = {
        question_order: $scope.questions.length + 1,
        question_text: "Enter text",
        question_choices: [{order: 1, criteria: "Enter text"}]
    };
    $scope.new_question.question_choices = [{order: 1, criteria: "Enter text"}];
    $scope.dialogModel = {
        message : 'message from passed scope'
    };
    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.questionOptionAdd = function () {
        $scope.new_question.question_choices.push({order: $scope.new_question.question_choices.length + 1, criteria: "Enter text"});
    };

    $scope.questionOptionDelete = function (index) {
        console.log(index);
        $scope.new_question.question_choices.splice(index, 1);
        // var i;
        $scope.new_question.question_choices.forEach(function (el, i) {
            el.order = i + 1;
        });
    };
    $scope.questionCreate = function () {
        console.log('yes');
        // var new_question_data = {
            // firstName: $scope.fname,
            // lastName: $scope.lname,
            // username: $scope.username,
            // email: $scope.email,
            // password: $scope.password,
            // // ADD ROLE IN CREATION EVENT
            // role: $scope.roleSelect,
            // address: [$scope.address],
            // language: [$scope.language]
        // };

    //     rgiUserMethodSrvc.createUser(newUserData).then(function () {
    //         // rgiMailer.send($scope.email);
    //         rgiNotifier.notify('User account created!' + $scope.email);
    //         $location.path('/admin/user-admin');
    //     }, function (reason) {
    //         rgiNotifier.error(reason);
    //     });
    };
});
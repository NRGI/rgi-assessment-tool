angular
    .module('app')
    .controller('rgiNewQuestionDialogCtrl', function (
        $scope,
        ngDialog,
        rgiNotifier
    ) {
        'use strict';
        $scope.new_question = {
            question_order: $scope.questions.length + 1,
            question_text: "Enter text",
            question_choices: [{order: 1, criteria: "Enter text"}]
        };
        $scope.new_question.question_choices = [{order: 1, criteria: "Enter text"}];
        $scope.dialogModel = {
            message: 'message from passed scope'
        };
        $scope.closeDialog = function () {
            ngDialog.close();
        };

        $scope.questionOptionAdd = function () {
            $scope.new_question.question_choices.push({
                order: $scope.new_question.question_choices.length + 1,
                criteria: "Enter text"
            });
        };

        $scope.questionOptionDelete = function (index) {
            $scope.new_question.question_choices.splice(index, 1);
            // var i;
            $scope.new_question.question_choices.forEach(function (el, i) {
                el.order = i + 1;
            });
        };
        //TODO ADD new question functionality
        $scope.questionCreate = function () {
            rgiNotifier.error('Function coming soon!');
            // data.forEach(function (el, i) {
            //     newQuestionData.push({
            //         root_QID: el._id,
            //         assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
            //         component: el.component,
            //         component_text: el.component_text,
            //         indicator_name: el.indicator_name,
            //         nrc_precept: el.nrc_precept,
            //         old_reference: el.old_reference,
            //         question_order: el.question_order,
            //         question_choices: [],
            //         question_text: el.question_text,
            //         section_name: el.section_name,
            //         sub_indicator_name: el.sub_indicator_name
            //     });

            //     el.question_choices.forEach(function (q_el, j) {
            //         newQuestionData[newQuestionData.length - 1].question_choices.push({'criteria': q_el.criteria, 'name': q_el.name, 'order': q_el.order});
            //     });
            // });

            // // send to mongo
            // rgiAssessmentMethodSrvc.createAssessment(newAssessmentData)
            //     .then(rgiQuestionMethodSrvc.insertQuestionSet(newQuestionData))
            //     .then(function () {
            //         rgiNotifier.notify('Assessment deployed!');
            //         $location.path('/admin/assessment-admin');
            //     }, function (reason) {
            //         rgiNotifier.error(reason);
            //     });
        };
    });
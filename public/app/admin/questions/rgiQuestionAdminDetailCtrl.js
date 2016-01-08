angular
    .module('app')
    .controller('rgiQuestionAdminDetailCtrl', function (
        $scope,
        $route,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiQuestionMethodSrvc,
        rgiQuestionSrvc,
        rgiIdentitySrvc,
        rgiDialogFactory
    ) {
        'use strict';
        $scope.question = rgiQuestionSrvc.get({_id: $routeParams.id});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.page_type = 'question';

        $scope.precept_options = [
            {value: 1, text: 'Precept 1: Strategy, consultation and institutions'},
            {value: 2, text: 'Precept 2: Accountability and transparency'},
            {value: 3, text: 'Precept 3: Exploration and license allocation'},
            {value: 4, text: 'Precept 4: Taxation'},
            {value: 5, text: 'Precept 5: Local effects'},
            {value: 6, text: 'Precept 6: State-owned enterprise'},
            {value: 7, text: 'Precept 7: Revenue distribution'},
            {value: 8, text: 'Precept 8: Revenue volatility'},
            {value: 9, text: 'Precept 9: Government spending'},
            {value: 10, text: 'Precept 10: Private sector development'},
            {value: 11, text: 'Precept 11: Roles of international companies'},
            {value: 12, text: 'Precept 12: Roles of international actors'}
        ];

        $scope.type_options = [
            {value: 'context', text: 'Context'},
            {value: 'scored', text: 'Scored'},
            {value: 'shadow', text: 'Shadow'}
        ];

        $scope.component_options = [
            {value: 'context', text: 'Context'},
            {value: 'legal', text: 'Legal and Regulatory Structure'},
            {value: 'oversight', text: 'Oversight and Compliance'},
            {value: 'reporting', text: 'Reporting and Disclosure Practices'}
        ];

        $scope.questionOptionAdd = function () {
            $scope.question.question_choices.push({order: $scope.question.question_choices.length + 1, criteria: "Enter text"});
        };

        $scope.questionOptionDelete = function (index) {
            $scope.question.question_choices.splice(index, 1);

            $scope.question.question_choices.forEach(function (el, i) {
                el.order = i + 1;
            });
        };

        $scope.questionClear = function () {
            $route.reload();
        };
        //TODO fix reording questions---update happens in question controller
        $scope.questionUpdate = function () {
            var new_question_data = $scope.question;
            if (new_question_data.question_criteria.length < 1) {
                rgiNotifier.error('You must supply at least one option!');
            } else if (!new_question_data.question_guidance_text) {
                rgiNotifier.error('You must supply question guidance!');
            } else if (!new_question_data.question_order) {
                rgiNotifier.error('you must supply question order!');
            } else if (!new_question_data.question_text) {
                rgiNotifier.error('You must supply question text!');
            } else {
                rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
                    $location.path('/admin/question-admin');
                    rgiNotifier.notify('Question data has been updated');
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };

        $scope.deleteConfirmDialog = function () {
            rgiDialogFactory.questionDelete($scope);
        };
    });
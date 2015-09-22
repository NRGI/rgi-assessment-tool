angular
    .module('app')
    .controller('rgiAssessmentDetailCtrl', function (
        $scope,
        $routeParams,
        $location,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiUserListSrvc,
        rgiAnswerSrvc,
        rgiAssessmentMethodSrvc
    ) {
        'use strict';
        // filtering options
        $scope.sortOptions = [
            {value: "question_order", text: "Sort by Question Number"},
            {value: "component_id", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}];
        $scope.sortOrder = $scope.sortOptions[0].value;

        $scope.identity = rgiIdentitySrvc;

        rgiAssessmentSrvc.get({assessment_ID: $routeParams.assessment_ID}, function (assessment_data) {
            $scope.assessment = assessment_data;
            $scope.assessment.reviewer = rgiUserListSrvc.get({_id: assessment_data.reviewer_ID});
            $scope.assessment.researcher = rgiUserListSrvc.get({_id: assessment_data.researcher_ID});
            $scope.assessment.edited_by = rgiUserListSrvc.get({_id: assessment_data.modified[assessment_data.modified.length - 1].modified_by});
            //$scope.answers = [];
            //$scope.answers = rgiAnswerSrvc.query({assessment_ID: assessment_data.assessment_ID}, function (answers) {
            //    answers.forEach(function (el) {
            //        $scope.answers.push(el);
            //    });
            //});
            $scope.answers = rgiAnswerSrvc.query({assessment_ID: assessment_data.assessment_ID});
        });

        $scope.assessmentSubmit = function () {
            if ($scope.answers.length !== $scope.assessment.questions_complete) {
                rgiNotifier.error('You must complete all assessment questions');
            } else {
                $scope.value = true;
                ngDialog.open({
                    template: 'partials/dialogs/submit-confirmation-dialog',
                    controller: 'rgiSubmitConfirmationDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }
        };

        $scope.assessmentResubmit = function () {
            var new_assessment_data = $scope.assessment;

            if(new_assessment_data.questions_resubmitted !== new_assessment_data.questions_flagged) {
                rgiNotifier.error('You must resubmit all flagged answers!');
            } else {
                new_assessment_data.status = 'resubmitted';

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $location.path('/assessments');
                        rgiNotifier.notify('Assessment submitted!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
    });

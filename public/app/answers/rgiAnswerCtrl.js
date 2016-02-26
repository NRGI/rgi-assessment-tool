'use strict';

angular.module('app')
    .controller('rgiAnswerCtrl', function (
        $scope,
        $routeParams,
        $q,
        $timeout,
        $route,
        rgiNotifier,
        ngDialog,
        rgiAnswerSrvc,
        rgiDocumentSrvc,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiAssessmentSrvc
    ) {
        $scope.identity = rgiIdentitySrvc;
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.page_type = 'answer';
        $scope.isCollapsed = false;

        rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
            $scope.answer = answer;
            $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: answer.assessment_ID});
            $scope.flags = answer.flags;
            $scope.references = answer.references;
            $scope.question = answer.question_ID;
            if (answer[$scope.current_user.role + '_score']) {
                $scope.question.question_criteria.forEach(function (opt, i) {
                    if (i===answer[$scope.current_user.role + '_score'].order-1) {
                        opt.selected = true;
                        $scope.answer.new_answer_selection = i;
                    } else {
                        opt.selected = false;
                    }
                });
            };

            if (answer.guidance_dialog) {
                rgiDialogFactory.guidanceDialog($scope);
            }
        });

        var resetReference = function() {
            rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
                $scope.references = answer.references;
            });
        };

        resetReference();
        $scope.$on('RESET_REFERENCE_ACTION', resetReference);

    });
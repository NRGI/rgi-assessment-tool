'use strict';

angular
    .module('app')
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
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiAnswerMethodSrvc,
        rgiQuestionSrvc,
        rgiIntervieweeSrvc,
        rgiUserListSrvc
    ) {
        var current_user = rgiIdentitySrvc.currentUser;
        $scope.identity = rgiIdentitySrvc;
        $scope.page_type = 'answer';
        $scope.isCollapsed = false;

        $scope.dynamicPopover = {
            content: 'Hello, World!',
            templateUrl: 'myPopoverTemplate.html',
            title: 'Title'
        };

        rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (answer) {
            $scope.answer = answer;
            $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: answer.assessment_ID});
            rgiQuestionSrvc.get({_id: answer.question_ID}, function(question) {
                $scope.question = question;
                $scope.question.question_criteria.forEach(function (opt, i) {
                    if (i===answer[current_user.role + '_score'].order-1) {
                        opt.selected = true;
                        $scope.answer.new_answer_selection = i;
                    } else {
                        opt.selected = false;
                    }
                });
            });
            //$scope.question = rgiQuestionSrvc.get({_id: answer.question_ID});
            $scope.current_user = current_user;
            //$scope.answer_start = angular.copy($scope.answer);


            var citations = [],
                interviews = [],
                flags = [];
            answer.flags.forEach(function (el) {
                var flag = el;
                rgiUserListSrvc.get({_id: el.addressed_to}, function(user) {
                    flag.addressee = user;
                });
                flags.push(flag);
            });

            answer.references.citation.forEach(function (el) {
                rgiDocumentSrvc.get({_id: el.document_ID}, function (doc) {
                    doc.comment = el;
                    citations.push(doc);
                });
            });

            answer.references.human.forEach(function (el) {
                rgiIntervieweeSrvc.get({_id: el.interviewee_ID}, function (interviewee) {
                    interviewee.comment = el;
                    interviews.push(interviewee);
                });
            });


            $scope.flags = flags;
            $scope.citations = citations;
            $scope.interviews = interviews;

        });
    });
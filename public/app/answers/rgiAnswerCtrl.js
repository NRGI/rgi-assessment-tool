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
        rgiDialogFactory,
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
            $scope.flags = answer.flags;
            $scope.current_user = current_user;
            $scope.references = answer.references;

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

            if (answer.guidance_model) {
                answer.guidance_model = false;
                rgiAnswerMethodSrvc.updateAnswer(answer)
                    .then(function () {
                        rgiDialogFactory.guidanceDialog(answer);
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }

            //var citations = [],
            //    interviews = [];

            //answer.references.citation.forEach(function (el) {
            //    rgiDocumentSrvc.get({_id: el.document_ID}, function (doc) {
            //        doc.comment = el;
            //        citations.push(doc);
            //    });
            //});
            //
            //answer.references.human.forEach(function (el) {
            //    rgiIntervieweeSrvc.get({_id: el.interviewee_ID}, function (interviewee) {
            //        interviewee.comment = el;
            //        citations.push(interviewee);
            //    });
            //});

            //$scope.references = references;

        });
    });
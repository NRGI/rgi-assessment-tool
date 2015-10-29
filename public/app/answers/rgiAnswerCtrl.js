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
            $scope.question = rgiQuestionSrvc.get({_id: answer.question_ID});
            $scope.current_user = rgiIdentitySrvc.currentUser;
            //$scope.answer_start = angular.copy($scope.answer);


            var citations = [],
                interviews = [],
                flags = [];
            answer.flags.forEach(function (el) {
                var flag = el;
                rgiUserListSrvc.get({_id: el.addressed_to}, function(user) {
                    flag.addressee = user;
                    console.log(el);
                    console.log(flag);
                    console.log(user);
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

        //$scope.ngPopupConfig = {
        //    modelName: "myNgPopup",
        //    title: "RGI FLAGS",
        //    width: 650,
        //    height:350,
        //    templateUrl:"partials/dialogs/flag-answer-dialog",
        //    resizable:true,
        //    draggable:true,
        //    isShow: false,
        //    position: { top : 300, left : 500},
        //    onOpen: function(){
        //        //    var new_answer_data = $scope.$parent.answer,
        //        //        current_user = $scope.$parent.identity.currentUser,
        //        //        new_assessment_data = $scope.$parent.assessment,
        //        //        new_flag_data = {
        //        //            content: $scope.flag_content,
        //        //            author_name: current_user.firstName + ' ' + current_user.lastName,
        //        //            author: current_user._id,
        //        //            role: current_user.role,
        //        //            date: new Date().toISOString(),
        //        //            addressed: false
        //        //        };
        //        //
        //        //    new_answer_data.flags.push(new_flag_data);
        //        //
        //        //    if (new_answer_data.status === 'approved') {
        //        //        new_answer_data.status = 'flagged';
        //        //        new_assessment_data.questions_flagged += 1;
        //        //        new_assessment_data.questions_approved -= 1;
        //        //    } else if (new_answer_data.status !== 'flagged') {
        //        //        new_answer_data.status = 'flagged';
        //        //        new_assessment_data.questions_complete += 1;
        //        //        new_assessment_data.questions_flagged += 1;
        //        //    }
        //        //
        //        //    rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
        //        //        .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
        //        //        .then(function () {
        //        //            rgiNotifier.notify('Answer flagged');
        //        //            $scope.closeThisDialog();
        //        //            $route.reload();
        //        //        }, function (reason) {
        //        //            rgiNotifier.notify(reason);
        //        //        });
        //        //};
        //    }
        //}
    });
function zeroFill(number, width) {
    'use strict';
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}
// Review functions
function flagCheck(flags) {
    'use strict';
    var disabled = false;
    if (flags.length !== 0) {
        flags.forEach(function (el) {
            if (el.addressed === false) {
                disabled = true;
            }
        });
    }
    return disabled;
}
angular
    .module('app')
    .controller('rgiAnswerAltCtrl', function (
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
        rgiIntervieweeSrvc
    ) {
        'use strict';
        $scope.identity = rgiIdentitySrvc;
        $scope.page_type = 'answer';
        $scope.isCollapsed = false;

        $scope.dynamicPopover = {
            content: 'Hello, World!',
            templateUrl: 'myPopoverTemplate.html',
            title: 'Title'
        };
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

        rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
            $scope.answer = data;
            $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
            $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
            $scope.current_user = rgiIdentitySrvc.currentUser;
            $scope.answer_start = angular.copy($scope.answer);


            var citations = [];
            var interviews = [];

            data.references.citation.forEach(function (el) {
                rgiDocumentSrvc.get({_id: el.document_ID}, function (doc) {
                    doc.comment = el;
                    citations.push(doc);
                });
            });

            data.references.human.forEach(function (el) {
                rgiIntervieweeSrvc.get({_id: el.interviewee_ID}, function (interviewee) {
                    interviewee.comment = el;
                    interviews.push(interviewee);
                });
            });

            $scope.citations = citations;
            $scope.interviews = interviews;

        });
    });
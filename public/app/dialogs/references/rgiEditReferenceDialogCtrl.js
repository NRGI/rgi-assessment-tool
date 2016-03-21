'use strict';

angular.module('app')
    .controller('rgiEditReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        ngDialog,
        rgiAnswerMethodSrvc,
        rgiIntervieweeSrvc,
        rgiNotifier
    ) {
        var
            new_answer_data = $scope.$parent.$parent.answer,
            ref_index = $scope.$parent.$parent.ref_index;

        $scope.ref = new_answer_data.references[ref_index];

        if($scope.ref.citation_type === 'interview') {
            var intervieweeId = $scope.ref.interviewee_ID._id ? $scope.ref.interviewee_ID._id : $scope.ref.interviewee_ID;
            $scope.interviewee = rgiIntervieweeSrvc.get({_id: intervieweeId});
        }

        $scope.editReference = function(referenceIndex) {
            new_answer_data.references[referenceIndex] = $scope.ref;
            rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                $scope.closeDialog();
                $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                rgiNotifier.notify('The reference has been edited');
            }, function (reason) {
                rgiNotifier.error(reason);
            });
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });

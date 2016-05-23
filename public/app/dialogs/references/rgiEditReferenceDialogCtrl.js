'use strict';

angular.module('app')
    .controller('rgiEditReferenceDialogCtrl', function (
        $scope,
        $rootScope,
        rgiAnswerMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIntervieweeSrvc,
        rgiNotifier
    ) {
        var
            new_answer_data = $scope.$parent.$parent.answer,
            ref_index = $scope.$parent.$parent.ref_index;

        $scope.ref = new_answer_data.references[ref_index];
        var dateField = $scope.ref.citation_type === 'interview' ? 'contact_date' : 'date_accessed';

        if($scope.ref.citation_type === 'interview') {
            var intervieweeId = $scope.ref.interviewee_ID._id ? $scope.ref.interviewee_ID._id : $scope.ref.interviewee_ID;

            rgiIntervieweeSrvc.get({_id: intervieweeId}, function(interviewee) {
                $scope.interviewee = interviewee;
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee data failure'));
        }

        $scope.editReference = function(referenceIndex) {
            if($scope.ref[dateField]) {
                new_answer_data.references[referenceIndex] = $scope.ref;
                rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                    $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                    rgiNotifier.notify('The reference has been edited');
                }, function (reason) {
                    rgiNotifier.error(reason);
                }).finally($scope.closeThisDialog);
            } else {
                rgiNotifier.error('You must select the date');
            }
        };
    });

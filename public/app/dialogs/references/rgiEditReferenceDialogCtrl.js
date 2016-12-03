'use strict';

angular.module('app')
    .controller('rgiEditReferenceDialogCtrl', ['$scope', '$rootScope', 'rgiAnswerMethodSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiIntervieweeSrvc', 'rgiNotifier', function (
        $scope,
        $rootScope,
        rgiAnswerMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIntervieweeSrvc,
        rgiNotifier
    ) {
        var answerData = $scope.$parent.$parent.answer;
        $scope.ref = answerData.references[$scope.$parent.$parent.ref_index];

        if($scope.ref.citation_type === 'interview') {
            var interviewee = $scope.ref.interviewee_ID._id ? $scope.ref.interviewee_ID._id : $scope.ref.interviewee_ID;

            rgiIntervieweeSrvc.get({_id: interviewee}, function(intervieweeData) {
                $scope.interviewee = intervieweeData;
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee data failure'));
        }

        $scope.editReference = function(referenceIndex) {
            if($scope.ref[$scope.ref.citation_type === 'interview' ? 'contact_date' : 'date_accessed']) {
                answerData.references[referenceIndex] = $scope.ref;
                answerData.modified = true;

                rgiAnswerMethodSrvc.updateAnswer(answerData).then(function () {
                    $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                    rgiNotifier.notify('The reference has been edited');
                }, function (reason) {
                    rgiNotifier.error(reason);
                }).finally($scope.closeThisDialog);
            } else {
                rgiNotifier.error('You must select the date');
            }
        };
    }]);

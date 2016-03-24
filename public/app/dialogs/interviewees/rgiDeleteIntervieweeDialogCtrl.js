'use strict';

angular.module('app')
    .controller('rgiDeleteIntervieweeDialogCtrl', function (
        $scope,
        rgiIntervieweeMethodSrvc,
        rgiNotifier
    ) {
        var getIntervieweeIndex = function(currentInterviewee) {
            var intervieweeIndex = -1;

            $scope.interviewees.forEach(function(interviewee, index) {
                if(interviewee._id === currentInterviewee._id) {
                    intervieweeIndex = index;
                }
            });

            return intervieweeIndex;
        };

        $scope.deleteInterviewee = function() {
            rgiIntervieweeMethodSrvc.deleteInterviewee($scope.interviewee._id).then(function() {
                $scope.closeThisDialog();
                rgiNotifier.notify('The interviewee has been deleted');
                $scope.interviewees.splice(getIntervieweeIndex($scope.interviewee), 1);
            }, function(reason) {
                rgiNotifier.error(reason);
            });
        };
    });

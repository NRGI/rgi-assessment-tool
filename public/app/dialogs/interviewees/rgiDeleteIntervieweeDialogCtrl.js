'use strict';

angular.module('app')
    .controller('rgiDeleteIntervieweeDialogCtrl', function ($scope, $location, rgiIntervieweeMethodSrvc, rgiNotifier) {
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

                if($scope.redirectToIntervieweeList) {
                    $location.path('/admin/interviewees-admin');
                } else {
                    $scope.interviewees.splice(getIntervieweeIndex($scope.interviewee), 1);
                }
            }, function(reason) {
                rgiNotifier.error(reason);
            });
        };
    });

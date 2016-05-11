'use strict';

angular.module('app')
    .controller('rgiDeleteCommentDialogCtrl', function (
        $scope,
        rgiAnswerMethodSrvc,
        rgiNotifier
    ) {
        $scope.deleteComment = function() {
            $scope.comment.hidden = true;

            rgiAnswerMethodSrvc.updateAnswer($scope.$parent.update).then(function() {
                rgiNotifier.notify('The comment has been deleted');
            }, function(reason) {
                $scope.comment.hidden = false;
                rgiNotifier.error(reason);
            }).finally($scope.closeThisDialog);
        };
    });

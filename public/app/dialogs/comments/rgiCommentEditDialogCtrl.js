'use strict';

angular.module('app')
    .controller('rgiCommentEditDialogCtrl', function (
        $scope,
        rgiNotifier,
        rgiAnswerMethodSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.commentContent = $scope.ngDialogData.comment.content;

        $scope.isCommentModificationValid = function() {
            return ($scope.commentContent.length > 0) && ($scope.commentContent !== $scope.ngDialogData.comment.content);
        };

        $scope.saveComment = function () {
            $scope.ngDialogData.comment.content = $scope.commentContent;

            rgiAnswerMethodSrvc.updateAnswer($scope.ngDialogData.answer)
                .then(function () {
                    rgiNotifier.notify('Comment edited');
                    $scope.closeThisDialog();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        };
    });

'use strict';

angular.module('app')
    .controller('rgiCommentEditDialogCtrl', function (
        $scope,
        rgiNotifier,
        rgiAnswerMethodSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.comment_content = $scope.ngDialogData.comment.content;

        $scope.saveComment = function () {
            if ($scope.ngDialogData.comment.content === $scope.comment_content) {
                rgiNotifier.error('Do you have edits to submit?');
            } else {
                $scope.ngDialogData.answer.comments[$scope.ngDialogData.index].content = $scope.comment_content;

                rgiAnswerMethodSrvc.updateAnswer($scope.ngDialogData.answer)
                    .then(function () {
                        rgiNotifier.notify('Comment edited');
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
    });

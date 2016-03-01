'use strict';

angular.module('app')
    .controller('rgiCommentEditDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiAnswerMethodSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;

        $scope.comment_content = $scope.$parent.comment.content;

        $scope.saveComment = function () {
            var new_answer_data = $scope.$parent.update,
                new_comment_data = $scope.$parent.comment,
                index = $scope.$parent.index,
                answer_ID = $scope.$parent.update.answer_ID;
            if (new_comment_data.content === $scope.comment_content) {
                rgiNotifier.error('Do you have edits to submit?');
            } else {
                new_answer_data.comments[index].content = $scope.comment_content;

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(function () {
                        rgiNotifier.notify('Comment edited');
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.notify(reason);
                    });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
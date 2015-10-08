'use strict';

angular.module('app').controller('rgiCommentsCtrl', function ($scope, ngDialog, rgiIdentitySrvc, rgiAnswerMethodSrvc, rgiNotifier) {

    $scope.answerCommentSubmit = function () {
        var current_user = rgiIdentitySrvc.currentUser,
            new_comment_data = {
                content: $scope.answer.new_comment,
                author_name: current_user.firstName + ' ' + current_user.lastName,
                author: current_user._id,
                role: current_user.role,
                date: new Date().toISOString()
            },
            new_answer_data = $scope.answer;

        new_answer_data.comments.push(new_comment_data);

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Comment added');
            $scope.answer.new_comment = undefined;
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };

    $scope.commentEdit = function (comment, index) {
        $scope.value = true;
        var scope = $scope;
        scope.index = index;
        scope.comment = comment;

        ngDialog.open({
            template: 'partials/dialogs/comment-edit-dialog',
            controller: 'rgiCommentEditDialogCtrl',
            className: 'ngdialog-theme-default dialogwidth800',
            scope: scope
        });
    };
});
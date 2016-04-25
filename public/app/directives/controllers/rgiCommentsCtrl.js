'use strict';

angular.module('app')
    .controller('rgiCommentsCtrl', function (
        $scope,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc,
        rgiQuestionMethodSrvc,
        rgiNotifier
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;

        $scope.submitComment = function () {
            var new_comment_data = {
                    content: $scope.update.new_comment,
                    author: $scope.current_user._id,
                    date: new Date().toISOString()
                },
                new_update_data = $scope.update;

            if(!new_comment_data.content) {
                rgiNotifier.error('You must include a comment before submitting!');
            } else {
                new_update_data.comments.push(new_comment_data);

                if (new_update_data.status === 'assigned' && !$scope.current_user.isSupervisor()) {
                    new_update_data.status = 'saved';
                }

                var saveComment;

                if($scope.$parent.page_type === 'answer') {
                    saveComment = rgiAnswerMethodSrvc.updateAnswer;
                } else if($scope.$parent.page_type === 'question') {
                    saveComment = rgiQuestionMethodSrvc.updateQuestion;
                }

                if(saveComment === undefined) {
                    rgiNotifier.error('Unrecognized page format!');
                } else {
                    saveComment(new_update_data).then(function () {
                        rgiNotifier.notify('Comment added');
                        $scope.update.new_comment = undefined;
                        new_update_data.comments[new_update_data.comments.length - 1].author = $scope.current_user;
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
                }
            }
        };

        $scope.isAuthor = function(comment) {
            var currentUserId = $scope.current_user._id;
            return comment.author._id ? (comment.author._id === currentUserId) : (comment.author === currentUserId);
        };

        $scope.editComment = function (comment) {
            rgiDialogFactory.commentEdit($scope.update, comment);
        };

        $scope.deleteComment = function(comment) {
            rgiDialogFactory.deleteComment($scope, comment);
        };
    });

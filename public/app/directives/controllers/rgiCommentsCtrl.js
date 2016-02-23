'use strict';

angular.module('app')
    .controller('rgiCommentsCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiDialogFactory,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc,
        rgiQuestionMethodSrvc,
        rgiNotifier
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;

        $scope.commentSubmit = function () {
            var current_user = rgiIdentitySrvc.currentUser,
                new_comment_data = {
                    content: $scope.update.new_comment,
                    author: current_user._id,
                    date: new Date().toISOString()
                },
                new_update_data = $scope.update;

            if(!new_comment_data.content) {
                rgiNotifier.error('You must include a comment before submitting!');
            } else {
                new_update_data.comments.push(new_comment_data);

                if (new_update_data.status === 'assigned' && !$scope.$root.current_user.isSupervisor()) {
                    new_update_data.status = 'saved';
                }

                switch($scope.$parent.page_type) {
                    case 'answer':
                        rgiAnswerMethodSrvc.updateAnswer(new_update_data).then(function () {
                            rgiNotifier.notify('Comment added');
                            $scope.update.new_comment = undefined;
                            $route.reload();
                        }, function (reason) {
                            rgiNotifier.notify(reason);
                        });
                        break;
                    case 'question':
                        rgiQuestionMethodSrvc.updateQuestion(new_update_data).then(function () {
                            rgiNotifier.notify('Comment added');
                            $scope.update.new_comment = undefined;
                            $route.reload();
                        }, function (reason) {
                            rgiNotifier.notify(reason);
                        });
                        break;
                    default:
                        rgiNotifier.error('Unrecognized page format!');

                }
            }
        };
        $scope.commentEdit = function (comment, index) {
            rgiDialogFactory.commentEdit($scope, comment, index);
        };
    });
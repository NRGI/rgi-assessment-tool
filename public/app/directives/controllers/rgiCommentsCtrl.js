'use strict';

angular
    .module('app')
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

        $scope.commentSubmit = function () {
            var current_user = rgiIdentitySrvc.currentUser,
                new_comment_data = {
                    content: $scope.update.new_comment,
                    author_name: current_user.firstName + ' ' + current_user.lastName,
                    author: current_user._id,
                    role: current_user.role,
                    date: new Date().toISOString()
                },
                new_update_data = $scope.update;

            new_update_data.comments.push(new_comment_data);

            if (new_update_data.status === 'assigned') {
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

            //rgiAnswerMethodSrvc.updateAnswer(new_update_data).then(function () {
            //    rgiNotifier.notify('Comment added');
            //    $scope.update.new_comment = undefined;
            //    $route.reload();
            //}, function (reason) {
            //    rgiNotifier.notify(reason);
            //});
        };
        $scope.commentEdit = function (comment, index) {
            rgiDialogFactory.assessmentMove($scope, comment, index);
        };
    });
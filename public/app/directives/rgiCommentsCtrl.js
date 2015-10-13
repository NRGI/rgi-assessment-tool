'use strict';

angular.module('app').controller('rgiCommentsCtrl', function ($scope, $route, ngDialog, rgiIdentitySrvc, rgiAnswerMethodSrvc, rgiQuestionMethodSrvc, rgiNotifier) {
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

//'use strict';
//
//angular
//    .module('app')
//    .controller('rgiCommentsCtrl', function (
//        $scope,
//        ngDialog,
//        rgiIdentitySrvc,
//        rgiAnswerMethodSrvc,
//        rgiNotifier
//    ) {
//        $scope.current_user = rgiIdentitySrvc.currentUser;
//        switch($scope.$parent.page_type) {
//            case 'answer':
//                rgiNotifier.notify('ANSWER');
//                //$scope.commentSubmit = function () {
//                //    var new_comment_data = {
//                //            content: $scope.update.new_comment,
//                //            author_name: current_user.firstName + ' ' + current_user.lastName,
//                //            author: current_user._id,
//                //            role: current_user.role,
//                //            date: new Date().toISOString()
//                //        },
//                //        new_answer_data = $scope.update;
//                //
//                //    new_answer_data.comments.push(new_comment_data);
//                //
//                //    if (new_answer_data.status === 'assigned') {
//                //        new_answer_data.status = 'saved';
//                //    }
//
//                //    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
//                //        rgiNotifier.notify('Comment added');
//                //        $scope.update.new_comment = undefined;
//                //    }, function (reason) {
//                //        rgiNotifier.notify(reason);
//                //    });
//                //};
//                //
//                $scope.commentEdit = function (comment, index) {
//                //    $scope.value = true;
//                //    var scope = $scope;
//                //    scope.index = index;
//                //    scope.comment = comment;
//                //
//                //    ngDialog.open({
//                //        template: 'partials/dialogs/comment-edit-dialog',
//                //        controller: 'rgiCommentEditDialogCtrl',
//                //        className: 'ngdialog-theme-default dialogwidth800',
//                //        scope: scope
//                //    });
//                };
//                break;
//
//            case 'question':
//                rgiNotifier.notify('QUESTION');
//                //$scope.commentSubmit = function () {
//                //    var new_comment_data = {
//                //            content: $scope.update.new_comment,
//                //            author_name: current_user.firstName + ' ' + current_user.lastName,
//                //            author: current_user._id,
//                //            role: current_user.role,
//                //            date: new Date().toISOString()
//                //        },
//                //        new_question_data = $scope.update;
//                //
//                //    new_question_data.comments.push(new_comment_data);
//                //
//                    rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
//                        rgiNotifier.notify('Comment added');
//                    }, function (reason) {
//                        rgiNotifier.notify(reason);
//                    });
//                //};
//                break;
//
//            default:
//                rgiNotifier.error('Unrecognized page format!');
//
//        }
//
//
//
//    });
//
//
////'use strict';
////
////angular
////    .module('app')
////    .controller('rgiCommentsCtrl', function (
////        $scope,
////        ngDialog,
////        rgiIdentitySrvc,
////        rgiAnswerMethodSrvc,
////        rgiAnswerSrvc,
////        rgiQuestionMethodSrvc,
////        rgiQuestionSrvc,
////        rgiNotifier
////    ) {
////        ////MAKE API CALL BASED ON PAGE TYPE
////        ////if($scope[$scope.page_type]) {
////        ////    $scope.comments = $scope[$scope.page_type];
////        ////} else {
////        ////    console.log($scope.question);
////        ////    $scope.comments = $scope[$scope.page_type];
////        ////}
////        //$scope.comments = $scope.$parent[$scope.page_type];
////        //console.log($scope);
////
////        switch($scope.page_type) {
////            case 'answer':
////                $scope.comments = $scope.$parent.answer;
////                console.log($scope);
////                $scope.commentSubmit = function () {
////                    var current_user = rgiIdentitySrvc.currentUser,
////                        new_comment_data = {
////                            content: $scope.new_comment,
////                            author_name: current_user.firstName + ' ' + current_user.lastName,
////                            author: current_user._id,
////                            role: current_user.role,
////                            date: new Date().toISOString()
////                        },
////                        new_answer_data = $scope.answer;
////
////                    new_answer_data.comments.push(new_comment_data);
////
////                    if (new_answer_data.status === 'assigned') {
////                        new_answer_data.status = 'saved';
////                    }
////
////                    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
////                        rgiNotifier.notify('Comment added');
////                        $scope.answer.new_comment = undefined;
////                    }, function (reason) {
////                        rgiNotifier.notify(reason);
////                    });
////                };
////                break;
////            case 'questino':
////                console.log($scope.page_type);
////                break;
////            default:
////                rgiNotifier.error('Unrecognized page format!');
////        };
////
////        //$scope.answerCommentSubmit = function () {
////        //    var current_user = rgiIdentitySrvc.currentUser,
////        //        new_comment_data = {
////        //            content: $scope.new_comment,
////        //            author_name: current_user.firstName + ' ' + current_user.lastName,
////        //            author: current_user._id,
////        //            role: current_user.role,
////        //            date: new Date().toISOString()
////        //        },
////        //        new_answer_data = $scope.answer;
////        //
////        //    new_answer_data.comments.push(new_comment_data);
////        //
////        //    if (new_answer_data.status === 'assigned') {
////        //        new_answer_data.status = 'saved';
////        //    }
////        //
////        //    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
////        //        rgiNotifier.notify('Comment added');
////        //        $scope.answer.new_comment = undefined;
////        //    }, function (reason) {
////        //        rgiNotifier.notify(reason);
////        //    });
////        //};
////        //$scope.questionCommentSubmit = function () {
////        //    var current_user = rgiIdentitySrvc.currentUser,
////        //        new_comment_data = {
////        //            content: $scope.new_comment,
////        //            author_name: current_user.firstName + ' ' + current_user.lastName,
////        //            author: current_user._id,
////        //            role: current_user.role,
////        //            date: new Date().toISOString()
////        //        },
////        //        new_question_data = $scope.question;
////        //
////        //    new_question_data.comments.push(new_comment_data);
////        //
////        //    rgiQuestionMethodSrvc.updateQuestion(new_question_data).then(function () {
////        //        rgiNotifier.notify('Comment added');
////        //    }, function (reason) {
////        //        rgiNotifier.notify(reason);
////        //    });
////        //};
////
////        //$scope.commentEdit = function (comment, index) {
////        //    $scope.value = true;
////        //    var scope = $scope;
////        //    scope.index = index;
////        //    scope.comment = comment;
////        //
////        //    ngDialog.open({
////        //        template: 'partials/dialogs/comment-edit-dialog',
////        //        controller: 'rgiCommentEditDialogCtrl',
////        //        className: 'ngdialog-theme-default dialogwidth800',
////        //        scope: scope
////        //    });
////        //};
////    });
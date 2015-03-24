'use strict';
var angular;
angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, FileUploader, rgiUploadMethodSrvc, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier, $location) {
    $scope.identity = rgiIdentitySrvc;
    // $scope.uploader = new FileUploader();

    var uploader = $scope.uploader = new FileUploader({
        isHTML5: true,
        withCredentials: true,
        url: 'file-upload'
    });
//     uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
//         console.info('onWhenAddingFileFailed', item, filter, options);
//     };
//     uploader.onAfterAddingFile = function (fileItem) {
//         console.info('onAfterAddingFile', fileItem);
//     };
//     uploader.onAfterAddingAll = function (addedFileItems) {
//         console.info('onAfterAddingAll', addedFileItems);
//     };
//     uploader.onBeforeUploadItem = function (item) {
//         console.info('onBeforeUploadItem', item);
//     };
//     uploader.onProgressItem = function (fileItem, progress) {
//         console.info('onProgressItem', fileItem, progress);
//     };
//     uploader.onProgressAll = function (progress) {
//         console.info('onProgressAll', progress);
//     };
//     uploader.onSuccessItem = function (fileItem, response, status, headers) {
//         console.info('onSuccessItem', fileItem, response, status, headers);
//     };
//     uploader.onErrorItem = function (fileItem, response, status, headers) {
//         console.info('onErrorItem', fileItem, response, status, headers);
//     };
//     uploader.onCancelItem = function (fileItem, response, status, headers) {
//         console.info('onCancelItem', fileItem, response, status, headers);
//     };
//     uploader.onCompleteItem = function (fileItem, response, status, headers) {
//         console.info('onCompleteItem', fileItem, response, status, headers);
//     };
//     uploader.onCompleteAll = function () {
//         console.info('onCompleteAll');
//     };

//     console.info('uploader', uploader);
// // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    // var assessment_ID = $routeParams.answer_ID.substring(0,2);
    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        $scope.answer_start = angular.copy($scope.answer);

    });

    $scope.answerClear = function () {
        $scope.answer = angular.copy($scope.answer_start);
    };

    $scope.answerSave = function () {
        var new_answer_data = $scope.answer;

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Answer saved');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };

    $scope.answerSubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status !== 'submitted') {
            new_answer_data.status = 'submitted';
        }
        new_assessment_data.questions_complete += 1;

        console.log(new_assessment_data);
        console.log(new_answer_data);

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                $location.path('/assessments/' + new_answer_data.assessment_ID);
                rgiNotifier.notify('Answer submitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data = {
            content: $scope.answer.new_comment,
            author_name: current_user.firstName + ' ' + current_user.lastName,
            author: current_user._id,
            role: current_user.roles[0],
            date: new Date().toISOString()
        },
            new_answer_data = $scope.answer;

        new_answer_data.comments.push(new_comment_data);

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Comment added');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
});
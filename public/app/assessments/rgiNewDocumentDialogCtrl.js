'use strict';
var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiNewDocumentDialogCtrl', function ($scope, $routeParams, ngDialog, FileUploader, rgiAnswerSrvc, rgiUserListSrvc) {


    var question = rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID});

    var uploader = $scope.uploader = new FileUploader({
        isHTML5: true,
        withCredentials: true,
        url: 'file-upload?assessment_id=' + $routeParams.answer_ID.substring(0, 10) + '&question_id=' + question._id + '&answer_id=' + $routeParams.answer_ID
        // url: 'file-upload?assessment_id=' + $routeParams.answer_ID.substring(0, 2) + '&question_id=' + $scope.question._id
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    // uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    //     console.info('onWhenAddingFileFailed', item, filter, options);
    // };
    // uploader.onAfterAddingFile = function (fileItem) {
    //     console.info('onAfterAddingFile', fileItem);
    // };
    // uploader.onAfterAddingAll = function (addedFileItems) {
    //     console.info('onAfterAddingAll', addedFileItems);
    // };
    // uploader.onBeforeUploadItem = function (item) {
    //     console.info('onBeforeUploadItem', item);
    // };
    // uploader.onProgressItem = function (fileItem, progress) {
    //     console.info('onProgressItem', fileItem, progress);
    // };
    // uploader.onProgressAll = function (progress) {
    //     console.info('onProgressAll', progress);
    // };
    // uploader.onSuccessItem = function (fileItem, response, status, headers) {
    //     console.info('onSuccessItem', fileItem, response, status, headers);
    // };
    // uploader.onErrorItem = function (fileItem, response, status, headers) {
    //     console.info('onErrorItem', fileItem, response, status, headers);
    // };
    // uploader.onCancelItem = function (fileItem, response, status, headers) {
    //     console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //     console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    uploader.onCompleteAll = function (fileItem, response, status, headers) {
        console.info('onCompleteAll', fileItem, response, status, headers);
        console.log($scope)
    };

    // console.info('uploader', uploader);
    // get current control profile onto scope and use it to populate workflowopts


    // rgiUserListSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
    //     var workflowOpts = [];
    //     if ($scope.$parent.assessment.status !== 'approved') {
    //         workflowOpts.push({
    //             text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
    //             value: 'review_' + control_profile.role
    //         });

    //         if (control_profile.role === 'researcher' && $scope.$parent.assessment.questions_flagged === 0) {
    //             rgiUserListSrvc.get({_id: $scope.$parent.assessment.reviewer_ID}, function (new_profile) {
    //                 workflowOpts.push({
    //                     text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
    //                     value: 'assigned_' + new_profile.role
    //                 });
    //             });
    //         } else if (control_profile.role === 'reviewer' && $scope.$parent.assessment.questions_flagged === 0) {
    //             rgiUserListSrvc.get({_id: $scope.$parent.assessment.researcher_ID}, function (new_profile) {
    //                 workflowOpts.push({
    //                     text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
    //                     value: 'assigned_' + new_profile.role
    //                 });
    //             });
    //         }
    //     }


    //     if ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.questions_unfinalized === 0 && $scope.$parent.assessment.status !== 'approved') {
    //          workflowOpts.push({
    //             text: 'Approve assessment',
    //             value: 'approved'
    //         });
    //     }

    //     // workflowOpts.push({
    //     //     text: 'Move to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ').',
    //     //     value: ''
    //     // }); 

    //     if ($scope.$parent.assessment.status === 'approved' || ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.status === 'under_review')) {
    //         workflowOpts.push({
    //             text: 'Move to internal review',
    //             value: 'internal_review'
    //         });
    //         workflowOpts.push({
    //             text: 'Move to external review',
    //             value: 'external_review'
    //         });
    //         workflowOpts.push({
    //             text: 'Final approval',
    //             value: 'final_approval'
    //         });
    //     }
    //     // } else {
    //     //     workflowOpts.push({
    //     //         text: 'Move to internal review',
    //     //         value: ''
    //     //     });
    //     //     workflowOpts.push({

    //     //         text: 'Move to external review',

    //     //         value: ''
    //     //     });
    //     //     workflowOpts.push({
    //     //         text: 'Final approval',
    //     //         value: ''
    //     //     });
    //     // }
    //     $scope.workflowOpts = workflowOpts;

    // });

    $scope.closeDialog = function () {
        ngDialog.close();
    };
});
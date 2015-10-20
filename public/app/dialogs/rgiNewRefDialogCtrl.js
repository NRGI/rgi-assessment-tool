'use strict';

angular.module('app').controller('rgiNewRefDialogCtrl', function (
    $scope,
    $route,
    $timeout,
    ngDialog,
    rgiAnswerMethodSrvc,
    rgiFileUploaderSrvc,
    rgiNotifier,
    rgiRequestSubmitterSrvc,
    rgiUrlCheckSrvc
) {
    $scope.fileUploading = false;
    $scope.answer_update = $scope.$parent.answer;
    ////TODO REPLACE WITH EXISITING REFERENCE SET
    //$scope.existing_ref = [
    //    {text: 'Add Document', value: 'document'},
    //    {text: 'Add Webpage', value: 'webpage'},
    //    {text: 'Add Interview', value: 'interview'}
    //];

    $scope.fileUrl = '';

    $scope.uploadFileByUrl = function() {
        var handleFileUploadStatus = function(responseStatus) {
            $scope.uploader.queue[$scope.uploader.queue.length - 1].progress = responseStatus.data.completion * 100;

            if(responseStatus.data.completion < 1) {
                $timeout(function() {
                    rgiRequestSubmitterSrvc.get('/api/remote-file/upload-progress/' + responseStatus.data._id).then(handleFileUploadStatus);
                }, 1000);
            } else {
                rgiRequestSubmitterSrvc.get('/api/remote-file/document/' + responseStatus.data._id).then(function(responseDocument) {
                    $scope.fileUploading = false;
                    uploader.onCompleteItem({}, responseDocument.data, responseDocument.status);
                });
            }
        };

        $scope.fileUploading = true;

        rgiRequestSubmitterSrvc.get('/api/remote-file-upload?url=' + encodeURIComponent($scope.fileUrl)).then(function(response) {
            if(response.data.reason) {
                $scope.fileUploading = false;
                rgiNotifier.error('The file cannot be uploaded');
            } else {
                $scope.uploader.queue.push({
                    file: {
                        name: $scope.fileUrl.split('/')[$scope.fileUrl.split('/').length - 1],
                        size: response.data.size
                    },
                    isUploading: true,
                    progress: response.data.completion * 100
                });
                handleFileUploadStatus(response);
            }
        });
    };

    //DATEPICKER OPTS
    $scope.date_format = 'MMMM d, yyyy';
    var today = new Date();
    $scope.date_default = today;
    $scope.date_max_limit = today;

    var uploader = $scope.uploader = rgiFileUploaderSrvc.get({
        isHTML5: true,
        withCredentials: true,
        url: 'file-upload'
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function () {
            return this.queue.length < 1;
        }
    });

    uploader.onCompleteItem = function (fileItem, response, status) {
        $scope.uploader.queue = [];

        if (status === 400) {
            rgiNotifier.error(response.reason);
        } else {// TODO add cancel upload after initial document pass
            $scope.new_document = response;
            $scope.value = true;

            var scope = $scope.$parent;
            scope.new_document = $scope.new_document;

            ngDialog.close('ngdialog1');
            ngDialog.open({
                template: 'partials/dialogs/new-document-dialog',
                controller: 'rgiNewDocumentDialogCtrl',
                className: 'ngdialog-theme-default',
                scope: scope
            });
        }
    };

    $scope.webRefSubmit = function () {
        var new_answer_data = $scope.answer_update, current_user = $scope.$parent.current_user, url, access_date;

        if(!new_answer_data.web_ref_url || !new_answer_data.web_ref_title) {
            rgiNotifier.error('You must enter a title and a url!');
        } else {
            if (new_answer_data.web_ref_url.split('://')[0] === 'http' || new_answer_data.web_ref_url.split('://')[0] === 'https') {
                url = new_answer_data.web_ref_url;
            } else {
                url = 'http://' + new_answer_data.web_ref_url;
            }

            if(!new_answer_data.web_ref_access_date) {
                access_date = $scope.date_default.toISOString();
            } else {
                access_date = new Date(new_answer_data.web_ref_access_date).toISOString();
            }

            rgiUrlCheckSrvc.isReal(url).then(function () {
                var new_ref_data = {
                    title: new_answer_data.web_ref_title,
                    URL: url,
                    access_date: access_date,
                    comment: {
                        date: new Date().toISOString(),
                        author: current_user._id,
                        author_name: current_user.firstName + ' ' + current_user.lastName,
                        role: current_user.role
                    }
                };

                if ($scope.answer_update.web_ref_comment !== undefined) {
                    new_ref_data.comment.content = $scope.answer_update.web_ref_comment;
                }

                new_answer_data.references.web.push(new_ref_data);

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                    $scope.closeThisDialog();
                    rgiNotifier.notify('Reference added!');
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });

            }, function () {
                rgiNotifier.error('Website does not exists');
            });
        }
    };

    $scope.humanRefSubmit = function () {

        var new_answer_data = $scope.answer_update,
            current_user = $scope.$parent.current_user,
            new_ref_data, contact_date;


        if (!new_answer_data.human_ref_first_name || !new_answer_data.human_ref_first_name) {
            rgiNotifier.error('You must enter an interviewee first and last name!');
        } else if (!new_answer_data.human_ref_email) {
            rgiNotifier.error('You must enter a valid email address!');
        } else {
            var email_domain = 'http://' + new_answer_data.human_ref_email.split('@')[1];
            if (email_domain === 'http://undefined') {
                rgiNotifier.error('You must enter a valid email address!');
            } else {
                if(!new_answer_data.human_ref_contact_date) {
                    contact_date = $scope.date_default.toISOString();
                } else {
                    contact_date = new Date(new_answer_data.human_ref_contact_date).toISOString();
                }
                new_ref_data = {
                    first_name: new_answer_data.human_ref_first_name,
                    last_name: new_answer_data.human_ref_last_name,
                    phone: new_answer_data.human_ref_phone,
                    email: new_answer_data.human_ref_email,
                    contact_date: contact_date,
                    comment: {
                        date: new Date().toISOString(),
                        author: current_user._id,
                        author_name: current_user.firstName + ' ' + current_user.lastName,
                        role: current_user.role
                    }
                };

                if (new_answer_data.human_ref_comment !== undefined) {
                    new_ref_data.comment.content = new_answer_data.human_ref_comment;
                }

                new_answer_data.references.human.push(new_ref_data);

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                    $scope.closeThisDialog();
                    rgiNotifier.notify('Reference added!');
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        }
        //
        ////TODO validate that email domain exists
        //if (email_domain === 'http://undefined') {
        //    rgiNotifier.error('You must enter a valid email address!')
        //} else {
        //    //isURLReal(email_domain)
        //    //    .fail(function (res) {
        //    //        console.log(res);
        //    //        rgiNotifier.error('Email Domain does not appear to be valid');
        //    //    })
        //    //    .done(function (res) {
        //    //        console.log(res);
        //    //    });
        //
        //}
    };

    $scope.closeDialog = function () {
        $scope.$parent.ref_selection = '';
        ngDialog.close();
    };
});

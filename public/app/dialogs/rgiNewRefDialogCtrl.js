'use strict';

angular
    .module('app')
    .controller('rgiNewRefDialogCtrl', function (
        $scope,
        $route,
        $timeout,
        $http,
        ngDialog,
        rgiNotifier,
        FileUploader,
        rgiAnswerMethodSrvc,
        rgiIntervieweeSrvc,
        rgiRequestSubmitterSrvc
    ) {

        function isURLReal(fullyQualifiedURL) {
            var URL = encodeURIComponent(fullyQualifiedURL),
                dfd = $.Deferred(),
                checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');

            checkURLPromise
                .done(function(res) {
                    // results should be null if the page 404s or the domain doesn't work
                    if (res.query.results) {
                        dfd.resolve(true);
                    } else {
                        dfd.reject(false);
                    }
                })
                .fail(function () {
                    dfd.reject('failed');


                });
            return dfd.promise();
        }

        $scope.answer_update = $scope.$parent.answer;
        $scope.interviewees = rgiIntervieweeSrvc.query({});
        //$scope.interviewee_list = [];
        //rgiIntervieweeSrvc.query({}, function (interviewees) {
        //    interviewees.forEach(function (el) {
        //        $scope.interviewees
        //        $scope.interviewee_list.push(el.firstName + ' ' + el.lastName);
        //        //console.log(el);
        //    });
        //});
        ////TODO REPLACE WITH EXISITING REFERENCE SET
        //$scope.existing_ref = [
        //    {text: 'Add Document', value: 'document'},
        //    {text: 'Add Webpage', value: 'webpage'},
        //    {text: 'Add Interview', value: 'interview'}
        //];

        //DATEPICKER OPTS
        var today = new Date();
        $scope.date_default = today;
        $scope.date_max_limit = today;
        $scope.date_options = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.date_formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.date_format = $scope.date_formats[0];
        $scope.status = {
            opened: false
        };
        $scope.calendarOpen = function($event) {
            $scope.status.opened = true;
        };

        $scope.fileUploading = false;
        $scope.fileUrl = '';
        var uploader = $scope.uploader = rgiFileUploaderSrvc.get({
            isHTML5: true,
            withCredentials: true,
            url: 'file-upload'
        });
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 1;
            }
        });
        //TODO handle doc and txt documents
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            if (status === 400) {
                $scope.uploader.queue = [];
                rgiNotifier.error(response.reason);
            } else {// TODO add cancel upload after initial document pass
                $scope.new_document = response;
                $scope.uploader.queue = [];
                $scope.value = true;
                var scope = $scope.$parent;
                scope.new_document = $scope.new_document;

                if (scope.ref_selection === 'document') {
                    ngDialog.close('ngdialog1');
                    ngDialog.open({
                        template: 'partials/dialogs/new-document-dialog',
                        controller: 'rgiNewDocumentDialogCtrl',
                        className: 'ngdialog-theme-default dialogwidth800',
                        scope: scope
                    });
                } else if (scope.ref_selection === 'webpage') {
                    ngDialog.close('ngdialog1');
                    ngDialog.open({
                        template: 'partials/dialogs/new-webpage-dialog',
                        controller: 'rgiNewWebpageDialogCtrl',
                        className: 'ngdialog-theme-default',
                        scope: scope
                    });
                }
            }
        };

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
                    if (!new_answer_data.human_ref_contact_date) {
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



//
//=======
//function isURLReal(fullyQualifiedURL) {
//    'use strict';
//    var URL = encodeURIComponent(fullyQualifiedURL),
//        dfd = $.Deferred(),
//        checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');
//
//    checkURLPromise
//        .done(function(res) {
//            // results should be null if the page 404s or the domain doesn't work
//            if (res.query.results) {
//                dfd.resolve(true);
//            } else {
//                dfd.reject(false);
//            }
//        })
//        .fail(function () {
//            dfd.reject('failed');
//        });
//    return dfd.promise();
//}
//>>>>>>> address jshint for public folder
//angular
//    .module('app')
//    .controller('rgiNewRefDialogCtrl', function (
//        $scope,
//        $route,
//<<<<<<< 4ec5f4a79fff6f34678574158482c11c0d029578
//        $timeout,
//        ngDialog,
//        rgiAnswerMethodSrvc,
//        rgiFileUploaderSrvc,
//        rgiIntervieweeSrvc,
//        rgiNotifier,
//        rgiRequestSubmitterSrvc
//    ) {
//
//        function isURLReal(fullyQualifiedURL) {
//            var URL = encodeURIComponent(fullyQualifiedURL),
//                dfd = $.Deferred(),
//                checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');
//
//            checkURLPromise
//                .done(function(res) {
//                    // results should be null if the page 404s or the domain doesn't work
//                    if (res.query.results) {
//                        dfd.resolve(true);
//                    } else {
//                        dfd.reject(false);
//                    }
//                })
//                .fail(function () {
//                    dfd.reject('failed');
//                });
//            return dfd.promise();
//        }
//
//        $scope.answer_update = $scope.$parent.answer;
//        $scope.interviewees = rgiIntervieweeSrvc.query({});
//        ////TODO REPLACE WITH EXISITING REFERENCE SET
//        //$scope.existing_ref = [
//        //    {text: 'Add Document', value: 'document'},
//        //    {text: 'Add Webpage', value: 'webpage'},
//        //    {text: 'Add Interview', value: 'interview'}
//        //];
//=======
//        $http,
//        ngDialog,
//        rgiNotifier,
//        FileUploader,
//        rgiAnswerMethodSrvc,
//        rgiIntervieweeSrvc
//    ) {
//        'use strict';
//        $scope.answer_update = $scope.$parent.answer;
//        //$scope.interviewee_list = [];
//        $scope.interviewees = rgiIntervieweeSrvc.query({});
//
//        //rgiIntervieweeSrvc.query({}, function (interviewees) {
//        //    interviewees.forEach(function (el) {
//        //        $scope.interviewees
//        //        $scope.interviewee_list.push(el.firstName + ' ' + el.lastName);
//        //        //console.log(el);
//        //    });
//        //});
//>>>>>>> address jshint for public folder
//
//        //DATEPICKER OPTS
//        $scope.date_format = 'MMMM d, yyyy';
//        var today = new Date();
//        $scope.date_default = today;
//        $scope.date_max_limit = today;
//
//<<<<<<< 4ec5f4a79fff6f34678574158482c11c0d029578
//        $scope.fileUploading = false;
//        $scope.fileUrl = '';
//        var uploader = $scope.uploader = rgiFileUploaderSrvc.get({
//=======
//        var uploader = $scope.uploader = new FileUploader({
//>>>>>>> address jshint for public folder
//            isHTML5: true,
//            withCredentials: true,
//            url: 'file-upload'
//        });
//        uploader.filters.push({
//            name: 'customFilter',
//<<<<<<< 4ec5f4a79fff6f34678574158482c11c0d029578
//            fn: function () {
//                return this.queue.length < 1;
//            }
//        });
//
//        //uploader.onCompleteItem = function (fileItem, response, status) {
//        //    $scope.uploader.queue = [];
//        //
//        //    if (status === 400) {
//        //        rgiNotifier.error(response.reason);
//        //    } else {// TODO add cancel upload after initial document pass
//        //        //$scope.new_document = response;
//        //        //$scope.uploader.queue = [];
//        //        var scope = $scope.$parent;
//        //        scope.value = true;
//        //        scope.new_document = $scope.new_document;
//        //
//        //        ngDialog.close('ngdialog1');
//        //        ngDialog.open({
//        //            template: 'partials/dialogs/new-document-dialog',
//        //            controller: 'rgiNewDocumentDialogCtrl',
//        //            className: 'ngdialog-theme-default',
//        //            scope: scope
//        //        });
//        //    }
//        //};
//        //TODO handle doc and txt documents
//        uploader.onCompleteItem = function (fileItem, response, status, headers) {
//            if (status === 400) {
//                $scope.uploader.queue = [];
//                rgiNotifier.error(response.reason);
//            } else {// TODO add cancel upload after initial document pass
//                $scope.new_document = response;
//                $scope.uploader.queue = [];
//                $scope.value = true;
//                var scope = $scope.$parent;
//                scope.new_document = $scope.new_document;
//
//
//                if (scope.ref_selection === 'document') {
//                    ngDialog.close('ngdialog1');
//                    ngDialog.open({
//                        template: 'partials/dialogs/new-document-dialog',
//                        controller: 'rgiNewDocumentDialogCtrl',
//                        className: 'ngdialog-theme-default',
//                        scope: scope
//                    });
//                } else if (scope.ref_selection === 'webpage') {
//                    ngDialog.close('ngdialog1');
//                    ngDialog.open({
//                        template: 'partials/dialogs/new-webpage-dialog',
//                        controller: 'rgiNewWebpageDialogCtrl',
//                        className: 'ngdialog-theme-default',
//                        scope: scope
//                    });
//                }
//            }
//
//        };
//
//        $scope.uploadFileByUrl = function() {
//            var handleFileUploadStatus = function(responseStatus) {
//                $scope.uploader.queue[$scope.uploader.queue.length - 1].progress = responseStatus.data.completion * 100;
//
//                if(responseStatus.data.completion < 1) {
//                    $timeout(function() {
//                        rgiRequestSubmitterSrvc.get('/api/remote-file/upload-progress/' + responseStatus.data._id).then(handleFileUploadStatus);
//                    }, 1000);
//                } else {
//                    rgiRequestSubmitterSrvc.get('/api/remote-file/document/' + responseStatus.data._id).then(function(responseDocument) {
//                        $scope.fileUploading = false;
//                        uploader.onCompleteItem({}, responseDocument.data, responseDocument.status);
//                    });
//                }
//            };
//
//            $scope.fileUploading = true;
//
//            rgiRequestSubmitterSrvc.get('/api/remote-file-upload?url=' + encodeURIComponent($scope.fileUrl)).then(function(response) {
//                if(response.data.reason) {
//                    $scope.fileUploading = false;
//                    rgiNotifier.error('The file cannot be uploaded');
//                } else {
//                    $scope.uploader.queue.push({
//                        file: {
//                            name: $scope.fileUrl.split('/')[$scope.fileUrl.split('/').length - 1],
//                            size: response.data.size
//                        },
//                        isUploading: true,
//                        progress: response.data.completion * 100
//                    });
//                    handleFileUploadStatus(response);
//                }
//            });
//        };
//
//        $scope.humanRefSubmit = function () {
//
//            var new_answer_data = $scope.answer_update,
//                current_user = $scope.$parent.current_user,
//                new_ref_data, contact_date;
//
//=======
//            fn: function (item /*{File|FileLikeObject}*/, options) {
//                return this.queue.length < 1;
//            }
//        });
//        //TODO handle doc and txt documents
//        uploader.onCompleteItem = function (fileItem, response, status, headers) {
//            if (status === 400) {
//                $scope.uploader.queue = [];
//                rgiNotifier.error(response.reason);
//            } else {// TODO add cancel upload after initial document pass
//                $scope.new_document = response;
//                $scope.uploader.queue = [];
//                $scope.value = true;
//                var scope = $scope.$parent;
//                scope.new_document = $scope.new_document;
//
//
//                if (scope.ref_selection === 'document') {
//                    ngDialog.close('ngdialog1');
//                    ngDialog.open({
//                        template: 'partials/dialogs/new-document-dialog',
//                        controller: 'rgiNewDocumentDialogCtrl',
//                        className: 'ngdialog-theme-default',
//                        scope: scope
//                    });
//                } else if (scope.ref_selection === 'webpage') {
//                    ngDialog.close('ngdialog1');
//                    ngDialog.open({
//                        template: 'partials/dialogs/new-webpage-dialog',
//                        controller: 'rgiNewWebpageDialogCtrl',
//                        className: 'ngdialog-theme-default',
//                        scope: scope
//                    });
//                }
//            }
//
//        };
//
//        $scope.humanRefSubmit = function (current_user) {
//            var new_answer_data = $scope.answer_update,
//                new_ref_data, contact_date;
//
//            if (!new_answer_data.human_ref_first_name || !new_answer_data.human_ref_first_name) {
//                rgiNotifier.error('You must enter an interviewee first and last name!');
//            } else if (!new_answer_data.human_ref_email) {
//                rgiNotifier.error('You must enter a valid email address!');
//            } else {
//                var email_domain = 'http://' + new_answer_data.human_ref_email.split('@')[1];
//                if (email_domain === 'http://undefined') {
//                    rgiNotifier.error('You must enter a valid email address!');
//                } else {
//                    if(!new_answer_data.human_ref_contact_date) {
//                        contact_date = $scope.date_default.toISOString();
//                    } else {
//                        contact_date = new Date(new_answer_data.human_ref_contact_date).toISOString();
//                    }
//                    new_ref_data = {
//                        first_name: new_answer_data.human_ref_first_name,
//                        last_name: new_answer_data.human_ref_last_name,
//                        phone: new_answer_data.human_ref_phone,
//                        email: new_answer_data.human_ref_email,
//                        contact_date: contact_date,
//                        comment: {
//                            date: new Date().toISOString(),
//                            author: current_user._id,
//                            author_name: current_user.firstName + ' ' + current_user.lastName,
//                            role: current_user.role
//                        }
//                    };
//
//                    if (new_answer_data.human_ref_comment !== undefined) {
//                        new_ref_data.comment.content = new_answer_data.human_ref_comment;
//                    }
//
//                    new_answer_data.references.human.push(new_ref_data);
//
//                    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
//                        $scope.closeThisDialog();
//                        rgiNotifier.notify('Reference added!');
//                        $route.reload();
//                    }, function (reason) {
//                        rgiNotifier.error(reason);
//                    });
//                }
//            }
//            //
//            ////TODO validate that email domain exists
//            //if (email_domain === 'http://undefined') {
//            //    rgiNotifier.error('You must enter a valid email address!')
//            //} else {
//            //    //isURLReal(email_domain)
//            //    //    .fail(function (res) {
//            //    //        console.log(res);
//            //    //        rgiNotifier.error('Email Domain does not appear to be valid');
//            //    //    })
//            //    //    .done(function (res) {
//            //    //        console.log(res);
//            //    //    });
//            //
//            //}
//        };
//        $scope.closeDialog = function () {
//            $scope.$parent.ref_selection = '';
//            ngDialog.close();
//        };
//    });
//>>>>>>> address jshint for public folder
//
//            if (!new_answer_data.human_ref_first_name || !new_answer_data.human_ref_first_name) {
//                rgiNotifier.error('You must enter an interviewee first and last name!');
//            } else if (!new_answer_data.human_ref_email) {
//                rgiNotifier.error('You must enter a valid email address!');
//            } else {
//                var email_domain = 'http://' + new_answer_data.human_ref_email.split('@')[1];
//                if (email_domain === 'http://undefined') {
//                    rgiNotifier.error('You must enter a valid email address!');
//                } else {
//                    if (!new_answer_data.human_ref_contact_date) {
//                        contact_date = $scope.date_default.toISOString();
//                    } else {
//                        contact_date = new Date(new_answer_data.human_ref_contact_date).toISOString();
//                    }
//                    new_ref_data = {
//                        first_name: new_answer_data.human_ref_first_name,
//                        last_name: new_answer_data.human_ref_last_name,
//                        phone: new_answer_data.human_ref_phone,
//                        email: new_answer_data.human_ref_email,
//                        contact_date: contact_date,
//                        comment: {
//                            date: new Date().toISOString(),
//                            author: current_user._id,
//                            author_name: current_user.firstName + ' ' + current_user.lastName,
//                            role: current_user.role
//                        }
//                    };
//
//                    if (new_answer_data.human_ref_comment !== undefined) {
//                        new_ref_data.comment.content = new_answer_data.human_ref_comment;
//                    }
//
//                    new_answer_data.references.human.push(new_ref_data);
//
//                    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
//                        $scope.closeThisDialog();
//                        rgiNotifier.notify('Reference added!');
//                        $route.reload();
//                    }, function (reason) {
//                        rgiNotifier.error(reason);
//                    });
//                }
//            }
//        };
//
//        $scope.closeDialog = function () {
//            $scope.$parent.ref_selection = '';
//            ngDialog.close();
//        };
//    });
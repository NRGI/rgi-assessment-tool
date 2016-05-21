'use strict';

angular.module('app')
    .controller('rgiNewRefDialogCtrl', function (
        $scope,
        $http,
        $rootScope,
        $timeout,
        rgiAllowedFileExtensionGuideSrvc,
        rgiAnswerMethodSrvc,
        rgiAssessmentSrvc,
        rgiDialogFactory,
        rgiDocumentSrvc,
        rgiFileUploaderSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiNotifier,
        rgiUtilsSrvc,
        FILE_SIZE_LIMIT
    ) {
        /////////////
        //INTERVIEWEE
        /////////////
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.salutation_opts = ['mr.', 'mrs.', 'ms.'];
        $scope.answer_update = $scope.$parent.answer;
        $scope.interviewee_list = [];
        $scope.document_list = [];
        $scope.selected_doc = 'none';

        $scope.role_opts = [
            {text: 'Government', value: 'government'},
            {text: 'CSO', value: 'cso'},
            {text: 'Industry', value: 'industry'},
            {text: 'Expert', value: 'expert'},
            {text: 'Other', value: 'other'}];

        rgiIntervieweeSrvc.query({users: $scope.current_user._id}, function (interviewees) {
            rgiHttpResponseProcessorSrvc.resetHandledFailuresNumber();

            interviewees.forEach(function (interviewee) {
                var interviewee_add = {
                    firstName: interviewee.firstName,
                    lastName: interviewee.lastName,
                    id: interviewee._id,
                    assessments: interviewee.assessments,
                    email: interviewee.email,
                    assessment_countries: []
                };

                interviewee.assessments.forEach(function (assessment_ID) {
                    rgiAssessmentSrvc.get({assessment_ID: assessment_ID}, function (assessment) {
                        interviewee_add.assessment_countries.push(assessment.country);
                    }, function(response) {
                        rgiHttpResponseProcessorSrvc.getNotRepeatedHandler('Load assessment data failure')(response);
                        $scope.closeThisDialog();
                    });
                });

                $scope.interviewee_list.push(interviewee_add);
            });
        }, function(response) {
            rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee data failure')(response);
            $scope.closeThisDialog();
        });

        var limit = 500,
            skip = 0;
        rgiDocumentSrvc.query({skip: skip, limit: limit, users: $scope.current_user._id}, function (response) {
            if(response.reason) {
                rgiNotifier.error('Load document data failure');
            } else {
                response.data.forEach(function(doc) {
                    $scope.document_list.push({
                        _id: doc._id,
                        title: doc.title
                    });
                });
            }
        }, function(response) {
            rgiHttpResponseProcessorSrvc.getDefaultHandler('Load document data failure')(response);
            $scope.closeThisDialog();
        });

        $scope.selectIntervieweeType = function (intervieweeType) {
            $scope.intervieweeType = intervieweeType;
        };

        $scope.interviewRefSubmit = function (selected_interviewee) {
            var contact_date, new_ref_data, selected_interviewee_ID,
                new_answer_data = $scope.answer_update,
                current_user = $scope.current_user;

            //error handling
            if (!new_answer_data.human_ref_comment) {
                rgiNotifier.error('You must enter interview content!');
            } else if (!new_answer_data.human_ref_contact_date) {
                rgiNotifier.error('You must enter interview date!');
            } else if (!selected_interviewee) {
                rgiNotifier.error('You must select an existing contact or create a new one!');
            } else {
                contact_date = new Date(new_answer_data.human_ref_contact_date).toISOString();

                if ($scope.intervieweeType === 'new') {
                    if (!selected_interviewee.firstName || !selected_interviewee.lastName) {
                        rgiNotifier.error('You must enter a first and last name for new interviewees!');
                    } else if (!selected_interviewee.role) {
                        rgiNotifier.error('You must select a type of organization for new interviewees!');
                    } else if (!selected_interviewee.organization) {
                        rgiNotifier.error('You must enter an organization for new interviewees!');
                    } else {
                        if (!selected_interviewee.email && !selected_interviewee.phone) {
                            rgiNotifier.error('You must enter a valid email address or phone number!');
                        } else {
                            selected_interviewee.answers = [new_answer_data.answer_ID];
                            selected_interviewee.assessments = [new_answer_data.assessment_ID];
                            selected_interviewee.questions = [new_answer_data.question_ID];
                            selected_interviewee.users = [current_user._id];
                            rgiIntervieweeMethodSrvc.createInterviewee(selected_interviewee)
                                .then(function (interviewee) {
                                    new_ref_data = {
                                        citation_type: 'interview',
                                        interviewee_ID: interviewee._id,
                                        contact_date: contact_date,
                                        comment: new_answer_data.human_ref_comment,
                                        author: current_user._id
                                    };
                                    new_answer_data.references.push(new_ref_data);
                                    new_answer_data[$scope.current_user.role + '_resolve_flag_required'] = false;
                                    rgiAnswerMethodSrvc.updateAnswer(new_answer_data).catch(function(reason) {
                                        rgiNotifier.error(reason);
                                    }).finally($scope.closeThisDialog);
                                })
                                .then(function () {
                                    $scope.closeThisDialog();
                                    $scope.answer_update.human_ref_comment = "";
                                    $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
                                    $timeout(function() {
                                        $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                                    }, 1000);
                                    rgiNotifier.notify('Reference added');
                                }, function () {
                                    rgiNotifier.error('The interviewee is cited by a different user. Please contact your supervisor with the interviewee details!');
                                });
                        }
                    }
                } else if ($scope.intervieweeType === 'existing') {
                    selected_interviewee_ID = selected_interviewee.originalObject.id;
                    new_ref_data = {
                        citation_type: 'interview',
                        interviewee_ID: selected_interviewee_ID,
                        contact_date: contact_date,
                        comment: new_answer_data.human_ref_comment,
                        author: current_user._id
                    };
                    new_answer_data.references.push(new_ref_data);
                    new_answer_data[$scope.current_user.role + '_resolve_flag_required'] = false;

                    rgiIntervieweeSrvc.get({_id: selected_interviewee_ID}, function (interviewee) {
                        ['answer', 'assessment', 'question'].forEach(function (el) {
                            if (interviewee[el+'s'] !== undefined && interviewee[el+'s'].indexOf(new_answer_data[el+'_ID']) < 0) {
                                interviewee[el+'s'].push(new_answer_data[el+'_ID']);
                            } else if (interviewee[el+'s'] === undefined) {
                                interviewee[el+'s'] = [new_answer_data[el+'_ID']];
                            }
                        });
                        if (interviewee.users !== undefined && interviewee.users.indexOf(current_user._id) < 0) {
                            interviewee.users.push(current_user._id);
                        } else if (interviewee.users === undefined) {
                            interviewee.users = [current_user._id];
                        }
                        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
                            rgiIntervieweeMethodSrvc.updateInterviewee(interviewee);
                            $scope.answer_update.human_ref_comment = "";
                            $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                            $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
                            rgiNotifier.notify('Reference added!');
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        }).finally($scope.closeThisDialog);
                    }, function(response) {
                        rgiHttpResponseProcessorSrvc.getDefaultHandler('Load interviewee data failure')(response);
                        $scope.closeThisDialog();
                    });
                } else {
                    rgiNotifier.error('Something happened assigning interviewees!');
                }
            }
        };

        $scope.closeDialog = function () {
            $scope.closeThisDialog();
            $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
        };

        ///////////////
        //FILE UPLOAD
        ///////////////
        $scope.fileUploading = false;
        $scope.answer_update = $scope.$parent.answer;
        var uploader = $scope.uploader = rgiFileUploaderSrvc.get({
            isHTML5: true,
            withCredentials: true,
            url: 'file-upload'
        });

        uploader.filters.push({
            name: 'singleFile',
            fn: function () {
                return this.queue.length < 1;
            }
        });

        $scope.isAllowedFileExtension = function(fileName) {
            var allowedExtensionFound = false, link = document.createElement('a');
            fileName = fileName.toLowerCase();
            link.href = fileName;

            rgiAllowedFileExtensionGuideSrvc.getList().forEach(function(extension) {
                var dottedExtension = '.' + extension;
                var extensionPosition = link.pathname.indexOf(dottedExtension);

                if((extensionPosition !== -1) && ((link.pathname.length - dottedExtension.length) === extensionPosition)) {
                    allowedExtensionFound = true;
                }
            });

            return allowedExtensionFound;
        };

        uploader.filters.push({
            name: 'allowedExtension',
            fn: function (fileItem) {
                if(!$scope.isAllowedFileExtension(fileItem.name)) {
                    rgiNotifier.error('Only ' + rgiAllowedFileExtensionGuideSrvc.getSerializedList() +
                    ' files can be uploaded. If this is in error, please try uploading file from desktop.');
                    return false;
                }

                return true;
            }
        });

        var fileExceedingLimitErrorMessage = 'The file size is too large to be uploaded';

        uploader.filters.push({
            name: 'fileSizeLimit',
            fn: function (fileItem) {
                if(fileItem.size > FILE_SIZE_LIMIT) {
                    rgiNotifier.error(fileExceedingLimitErrorMessage);
                    return false;
                }

                return true;
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
                //rgiDialogFactory[scope.ref_selection + 'Create']($scope);
                if (scope.ref_selection === 'document') {
                    rgiDialogFactory.documentCreate(scope);
                } else if (scope.ref_selection === 'webpage') {
                    rgiDialogFactory.webpageCreate(scope);
                }
            }
        };

        var processHttpFailure = function(response) {
            rgiHttpResponseProcessorSrvc.getDefaultHandler()(response);
            $scope.closeThisDialog();
        };

        var handleFileUploadFailure = function(errorMessage) {
            $scope.fileUploading = false;
            rgiNotifier.error(errorMessage);
        };

        $scope.uploadFileByUrl = function (fileUrl) {
            if (!$scope.isAllowedFileExtension(fileUrl)) {
                rgiNotifier.error('Only ' + rgiAllowedFileExtensionGuideSrvc.getSerializedList() + ' files can be uploaded');
            } else {
                $scope.fileUploading = true;

                if (fileUrl.split('://')[0] !== 'http' && fileUrl.split('://')[0] !== 'https') {
                    fileUrl = 'http://' + fileUrl;
                }

                var handleFileUploadStatus = function (responseStatus) {
                    $scope.uploader.queue[$scope.uploader.queue.length - 1].progress = responseStatus.data.completion * 100;

                    if (responseStatus.data.completion < 1) {
                        if(responseStatus.data.completion < 0) {
                            handleFileUploadFailure(fileExceedingLimitErrorMessage);
                        } else {
                            $timeout(function () {
                                $http.get('/api/remote-file/upload-progress/' + responseStatus.data._id)
                                    .then(handleFileUploadStatus)
                                    .catch(processHttpFailure);
                            }, 1000);
                        }
                    } else {
                        $http.get('/api/remote-file/document/' + responseStatus.data._id)
                            .then(function (responseDocument) {
                                $scope.fileUploading = false;
                                uploader.onCompleteItem({}, responseDocument.data, responseDocument.status);
                            })
                            .catch(processHttpFailure);
                    }
                };

                $http.get('/api/remote-file-upload?url=' + encodeURIComponent(fileUrl))
                    .then(function (response) {
                        if (response.data.reason) {
                            handleFileUploadFailure(response.data.reason);
                        } else {
                            $scope.uploader.queue.push({
                                file: {
                                    name: fileUrl.split('/')[fileUrl.split('/').length - 1],
                                    size: response.data.size
                                },
                                isUploading: true,
                                progress: response.data.completion * 100
                            });
                            handleFileUploadStatus(response);
                        }
                    })
                    .catch(processHttpFailure);
            }

        };

        $scope.uploadSnapshot = function(url) {
            $scope.fileUploading = true;
            if (url.split('://')[0] !== 'http' && url.split('://')[0] !== 'https') {
                url = 'http://' + url;
            }

            var getErrorMessage = function(errorCode) {
                switch(errorCode) {
                    case 'PAGE_CONNECT_FAILURE': return 'The snapshot generator cannot connect to the URL';
                    case 'PAGE_DEFINE_HEIGHT_FAILURE': return 'A snapshot of the web page cannot be generated because the page dimensions are undefined';
                    case 'PAGE_LOADING_TIMEOUT_EXPIRED': return 'Page loading timeout expired';
                    case 'PAGE_OPEN_FAILURE': return 'The snapshot generator failed to open the web page';
                    case 'PHANTOM_INITIALIZATION_FAILURE': return 'The snapshot generator initialization failed';
                    case 'SET_TIMEOUT_FAILURE': return 'The snapshot generator initialization failed';
                    case 'S3_TRANSFER_FAILURE': return 'A snapshot of the web page cannot be saved to the file storage';
                    case 'TOO_LARGE_SIZE': return 'A snapshot of the web page cannot be generated because of the page dimensions';
                    case 'VIEWPORT_RESIZE_FAILURE': return 'A snapshot of the web page with required dimensions cannot be generated';
                }
                return 'A snapshot of the web page cannot be generated because of unknown error';
            };

            rgiUtilsSrvc.isURLReal(url)
                .then(function () {
                    $http.get('/api/snapshot-upload?url=' + encodeURIComponent(url)).then(function (response) {
                        if(response.data.error) {
                            rgiNotifier.error(getErrorMessage(response.data.error));
                        } else {
                            response.data.result.source = url;
                            uploader.onCompleteItem({}, response.data.result, response.data.result.status);
                        }
                    }).catch(function() {
                        rgiNotifier.error('The snapshot cannot be generated');
                        processHttpFailure();
                    }).finally(function() {
                        $scope.fileUploading = false;
                    });
                }, function () {
                    $scope.fileUploading = false;
                    rgiNotifier.error('The URL is unavailable');
                });
        };
        $scope.selectPrevDoc = function(selected_doc) {
            rgiDocumentSrvc.get({_id: selected_doc}, function (document){
                $scope.new_document = document;
                $scope.value = true;
                var scope = $scope.$parent;
                //rgiDialogFactory[scope.ref_selection + 'Create']($scope);
                scope.new_document = $scope.new_document;
                if (scope.ref_selection === 'document') {
                    rgiDialogFactory.documentCreate(scope);
                } else if (scope.ref_selection === 'webpage') {
                    rgiDialogFactory.webpageCreate(scope);
                }
            }, function(response) {
                rgiHttpResponseProcessorSrvc.getDefaultHandler('Load document data failure')(response);
                $scope.closeThisDialog();
            });
        };
    });

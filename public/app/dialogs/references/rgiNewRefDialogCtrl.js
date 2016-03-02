'use strict';

angular.module('app')
    .controller('rgiNewRefDialogCtrl', function (
        $scope,
        $rootScope,
        $timeout,
        ngDialog,
        rgiAllowedFileExtensionGuideSrvc,
        rgiDialogFactory,
        rgiNotifier,
        FileUploader,
        rgiUtilsSrvc,
        rgiFileUploaderSrvc,
        rgiRequestSubmitterSrvc,
        rgiAnswerMethodSrvc,
        rgiAssessmentSrvc,
        rgiIntervieweeSrvc,
        rgiIntervieweeMethodSrvc,
        rgiIdentitySrvc
    ) {
        /////////////
        //INTERVIEWEE
        /////////////
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.editorContentMaxLength = $scope.$root.editorContentMaxLength;
        $scope.taToolbarOptions = $scope.$root.taToolbarOptions;

        $scope.role_opts = [
            {text: 'Government', value: 'government'},
            {text: 'CSO', value: 'cso'},
            {text: 'Industry', value: 'industry'},
            {text: 'Expert', value: 'expert'},
            {text: 'Other', value: 'other'}];
        $scope.salutation_opts = ['mr.', 'mrs.', 'ms.'];
        //Datepicker opts
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
        $scope.calendarOpen = function () {
            $scope.status.opened = true;
        };
        $scope.maxDate = today;

        $scope.answer_update = $scope.$parent.answer;
        $scope.interviewee_list = [];
        rgiIntervieweeSrvc.query({}, function (interviewees) {
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
                    });
                });
                $scope.interviewee_list.push(interviewee_add);
            });
        });

        $scope.intervieweeSelect = function (selection) {
            $scope.interviewee_selection = selection;
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

                if ($scope.interviewee_selection==='new') {
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
                                    rgiAnswerMethodSrvc.updateAnswer(new_answer_data);
                                })
                                .then(function () {
                                    $scope.closeThisDialog();
                                    $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                                    rgiNotifier.notify('Reference added');
                                }, function (reason) {
                                    rgiNotifier.notify(reason);
                                });
                            //email_domain = 'http://' + selected_interviewee.email.split('@')[1];
                            //if (email_domain === 'http://undefined') {
                            //    rgiNotifier.error('You must enter a valid email address!');
                            //} else {
                            //    selected_interviewee.answers = [new_answer_data.answer_ID];
                            //    selected_interviewee.assessments = [new_answer_data.assessment_ID];
                            //    selected_interviewee.questions = [new_answer_data.question_ID];
                            //    selected_interviewee.users = [current_user._id];
                            //    rgiIntervieweeMethodSrvc.createInterviewee(selected_interviewee)
                            //        .then(function (interviewee) {
                            //            new_ref_data = {
                            //                citation_type: 'interview',
                            //                interviewee_ID: interviewee._id,
                            //                contact_date: contact_date,
                            //                comment: new_answer_data.human_ref_comment,
                            //                author: current_user._id
                            //            };
                            //            new_answer_data.references.push(new_ref_data);
                            //            rgiAnswerMethodSrvc.updateAnswer(new_answer_data);
                            //        })
                            //        .then(function () {
                            //            $scope.closeThisDialog();
                            //            $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                            //            rgiNotifier.notify('Reference added');
                            //        }, function (reason) {
                            //            rgiNotifier.notify(reason);
                            //        });
                            //}
                        }
                    }
                } else if ($scope.interviewee_selection==='existing') {
                    selected_interviewee_ID = selected_interviewee.originalObject.id;
                    new_ref_data = {
                        citation_type: 'interview',
                        interviewee_ID: selected_interviewee_ID,
                        contact_date: contact_date,
                        comment: new_answer_data.human_ref_comment,
                        author: current_user._id
                    };
                    new_answer_data.references.push(new_ref_data);

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
                            $scope.closeThisDialog();
                            $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                            rgiNotifier.notify('Reference added!');

                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                    });
                } else {
                    rgiNotifier.error('Something happened assigning interviewees!');
                }
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
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
            var allowedExtensionFound = false;
            fileName = fileName.toLowerCase();

            rgiAllowedFileExtensionGuideSrvc.getList().forEach(function(extension) {
                var dottedExtension = '.' + extension;
                var extensionPosition = fileName.indexOf(dottedExtension);

                if((extensionPosition !== -1) && ((fileName.length - dottedExtension.length) === extensionPosition)) {
                    allowedExtensionFound = true;
                }
            });

            return allowedExtensionFound;
        };

        uploader.filters.push({
            name: 'allowedExtension',
            fn: function (fileItem) {
                var fileExtensionAllowed = $scope.isAllowedFileExtension(fileItem.name);

                if(!fileExtensionAllowed) {
                    rgiNotifier.error('Only ' + rgiAllowedFileExtensionGuideSrvc.getSerializedList() + ' files can be uploaded');
                }

                return fileExtensionAllowed;
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

        $scope.uploadFileByUrl = function (fileUrl) {
            if (fileUrl.split('://')[0] !== 'http' || fileUrl.split('://')[0] !== 'https') {
                fileUrl = 'http://' + fileUrl;
            }
            console.log(fileUrl);
            var handleFileUploadStatus = function (responseStatus) {
                $scope.uploader.queue[$scope.uploader.queue.length - 1].progress = responseStatus.data.completion * 100;

                if (responseStatus.data.completion < 1) {
                    $timeout(function () {
                        rgiRequestSubmitterSrvc.get('/api/remote-file/upload-progress/' + responseStatus.data._id).then(handleFileUploadStatus);
                    }, 1000);
                } else {
                    rgiRequestSubmitterSrvc.get('/api/remote-file/document/' + responseStatus.data._id).then(function (responseDocument) {
                        $scope.fileUploading = false;
                        uploader.onCompleteItem({}, responseDocument.data, responseDocument.status);
                    });
                }
            };

            $scope.fileUploading = true;
            rgiRequestSubmitterSrvc.get('/api/remote-file-upload?url=' + encodeURIComponent(fileUrl)).then(function (response) {
                if (response.data.reason) {
                    $scope.fileUploading = false;
                    rgiNotifier.error('The file cannot be uploaded');
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
            });

        };

        $scope.uploadSnapshot = function(url) {
            $scope.fileUploading = true;

            rgiUtilsSrvc.isURLReal(url)
                .then(function () {
                    rgiRequestSubmitterSrvc.get('/api/snapshot-upload?url=' + encodeURIComponent(url)).then(function (response) {
                        if(response.data.error) {
                            rgiNotifier.error(response.data.error);
                        } else {
                            uploader.onCompleteItem({}, response.data.result, response.data.result.status);
                        }
                    }, function(err) {
                        rgiNotifier.error(err);
                    }).finally(function() {
                        $scope.fileUploading = false;
                    });
                }, function () {
                    $scope.fileUploading = false;
                    rgiNotifier.error('The URL is unavailable');
                });
        };
    });

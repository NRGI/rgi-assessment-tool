'use strict';

angular.module('app')
    .controller('rgiNewWebpageDialogCtrl', function (
        _,
        $scope,
        $route,
        $rootScope,
        rgiUtilsSrvc,
        rgiNotifier,
        rgiAllowedFileExtensionGuideSrvc,
        rgiDocumentSrvc,
        rgiDocumentMethodSrvc,
        rgiIdentitySrvc,
        rgiAnswerMethodSrvc,
        rgiUserMethodSrvc
    ) {
        if ($scope.new_document.status === 'created') {
            $scope.new_document.authors = [{first_name: "", last_name: ""}];
        }
        $scope.new_document.type = 'web_page';
        $scope.disable_button = false;

        $scope.authorPush = function () {
            $scope.new_document.authors.push({first_name: "", last_name: ""});
        };

        $scope.authorPop = function (index) {
            $scope.new_document.authors.splice(index, 1);
        };

        $scope.documentRefSubmit = function () {
            var file_extension,
                new_document = $scope.$parent.$parent.new_document,
                allowed_extensions = rgiAllowedFileExtensionGuideSrvc.getList(),
                new_user_data = rgiIdentitySrvc.currentUser;

            $scope.disable_button=true;

            if (new_document.source) {
                file_extension = _.last(new_document.source.split('.'));
            }

            //check for minimum data
            if (!new_document.source) {
                rgiNotifier.error('You must provide a source URL!');
                $scope.disable_button = false;
            } else if (allowed_extensions.indexOf(file_extension) > -1) {
                rgiNotifier.error('This is a remote file. Please upload as a document!');
                $scope.closeThisDialog();
                $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
                $scope.disable_button=false;
            } else if (!new_document.title) {
                rgiNotifier.error('You must provide a title!');
                $scope.disable_button=false;
            } else if (!$scope.ref_date_accessed) {
                rgiNotifier.error('You must provide the date of access!');
                $scope.disable_button = false;
            } else {
                var assessment_ID = $scope.$parent.assessment.assessment_ID,
                    question_ID = $scope.$parent.question._id,
                    answer_ID = $scope.$parent.answer.answer_ID,
                    current_user_ID = rgiIdentitySrvc.currentUser._id,
                    new_answer_data = $scope.$parent.answer,
                    new_doc_data = new rgiDocumentSrvc(new_document),
                    new_ref_data = {
                        citation_type: 'document',
                        document_ID: new_document._id,
                        // mendeley_ID
                        file_hash: new_document.file_hash,
                        date_accessed: new Date($scope.ref_date_accessed).toISOString(),
                        author: current_user_ID
                    };

                //new_doc_data.source = url;

                if (new_doc_data.status === 'created') {
                    new_doc_data.status = 'submitted';
                }

                if (new_doc_data.assessments !== undefined && new_doc_data.assessments.indexOf(assessment_ID) < 0) {
                    new_doc_data.assessments.push(assessment_ID);
                } else if (new_doc_data.assessments === undefined) {
                    new_doc_data.assessments = [assessment_ID];
                }

                if (new_doc_data.questions !== undefined && new_doc_data.questions.indexOf(question_ID) < 0) {
                    new_doc_data.questions.push(question_ID);
                } else if (new_doc_data.questions === undefined) {
                    new_doc_data.questions = [question_ID];
                }

                if (new_doc_data.answers !== undefined && new_doc_data.answers.indexOf(answer_ID) < 0) {
                    new_doc_data.answers.push(answer_ID);
                } else if (new_doc_data.answers === undefined) {
                    new_doc_data.answers = [answer_ID];
                }

                if (new_doc_data.users !== undefined && new_doc_data.users.indexOf(current_user_ID) < 0) {
                    new_doc_data.users.push(current_user_ID);
                } else if (new_doc_data.users === undefined) {
                    new_doc_data.users = [current_user_ID];
                }

                if ($scope.answer.new_ref_comment !== undefined) {
                    new_ref_data.comment = $scope.answer.new_ref_comment;
                }

                if (new_user_data.documents !== undefined && new_user_data.documents.indexOf(new_document._id) < 0) {
                    new_user_data.documents.push(new_document._id);
                } else if (new_user_data.documents === undefined) {
                    new_user_data.documents = [new_document._id];
                }

                new_answer_data.references.push(new_ref_data);

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(rgiDocumentMethodSrvc.updateDocument(new_doc_data))
                    .then(rgiUserMethodSrvc.updateUser(new_user_data))
                    .then(function () {
                        $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                        $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
                        rgiNotifier.notify('Reference added!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    }).finally(function() {
                        $scope.disable_button = false;
                        $scope.closeThisDialog();
                    });
            }
        };

        $scope.closeDialog = function () {
            $scope.closeThisDialog();
            $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
        };
    });

'use strict';

angular.module('app')
    .controller('rgiNewDocumentDialogCtrl', ['$scope', '$rootScope', 'rgiNotifier', 'rgiAnswerMethodSrvc', 'rgiDocumentSrvc', 'rgiDocumentMethodSrvc', 'rgiIdentitySrvc', 'rgiUserMethodSrvc', function (
        $scope,
        $rootScope,
        rgiNotifier,
        rgiAnswerMethodSrvc,
        rgiDocumentSrvc,
        rgiDocumentMethodSrvc,
        rgiIdentitySrvc,
        rgiUserMethodSrvc
    ) {
        $scope.answer.new_ref_comment = '';
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.disable_button = false;
        if ($scope.new_document.status === 'created') {
            $scope.new_document.authors = [{first_name: "", last_name: ""}];
            $scope.new_document.editors = [{first_name: "", last_name: ""}];
        }
        $scope.new_document = $scope.$parent.new_document;
        $scope.new_document.source = $scope.source;

        $scope.new_doc_type = [
            {value: 'book', text: 'Book'},
            {value: 'book_section', text: 'Book Chapter'},
            {value: 'data_file', text: 'Data File'},
            {value: 'journal', text: 'Journal'},
            {value: 'case', text: 'Judicial Decision'},
            {value: 'newspaper_article', text: 'Press Article'},
            {value: 'parliamentary_meeting_note', text: 'Parliamentary meeting notes'},
            {value: 'policy_document', text: 'Policy document'},
            {value: 'report', text: 'Report'},
            {value: 'statute', text: 'Legislation'},
            {value: 'web_page', text: 'Web Page'},
            {value: 'working_paper', text: 'Working Paper'}
        ];

        $scope.authorPush = function () {
            $scope.new_document.authors.push({first_name: "", last_name: ""});
        };

        $scope.authorPop = function (index) {
            $scope.new_document.authors.splice(index, 1);
        };

        var showErrorMessage = function(errorMessage) {
            rgiNotifier.error(errorMessage);
            $scope.disable_button = false;
        };

        $scope.documentRefSubmit = function (new_document) {
            var new_user_data = rgiIdentitySrvc.currentUser;
            $scope.disable_button = true;

            //check for minimum data
            if (!$scope.new_document.title) {
                showErrorMessage('You must provide a title!');
            } else if (!$scope.new_document.type) {
                showErrorMessage('You must provide a document type!');
            } else if (($scope.new_document.status !== 'submitted') && !$scope.newDocumentForm.source.$valid) {
                showErrorMessage('You must provide the document source!');
            } else if (!$scope.new_ref_location) {
                showErrorMessage('You must provide the page location!');
            } else if (!$scope.new_document.publisher && (!$scope.new_document.authors[0].first_name || !$scope.new_document.authors[0].last_name)) {
                showErrorMessage('You must provide either a publisher or an author!');
            } else if (!$scope.new_document.year) {
                showErrorMessage('You must provide the year of publication!');
            } else {
                var assessment_ID = $scope.$parent.assessment.assessment_ID,
                    question_ID = $scope.$parent.question._id,
                    answer_ID = $scope.$parent.answer.answer_ID,
                    current_user_ID = $scope.current_user._id,
                    new_answer_data = $scope.$parent.answer,
                    new_doc_data = new rgiDocumentSrvc(new_document),
                    new_ref_data = {
                        citation_type: 'document',
                        document_ID: new_document._id,
                        file_hash: new_document.file_hash,
                        author: current_user_ID,
                        location: $scope.new_ref_location
                    };
                if (new_doc_data.source) {
                    if (new_doc_data.source.split('://')[0] !== 'http' && new_doc_data.source.split('://')[0] !== 'https') {
                        new_doc_data.source = 'http://' + new_doc_data.source;
                    }
                }

                if ($scope.ref_date_accessed) {
                    new_ref_data.date_accessed = new Date($scope.ref_date_accessed).toISOString();
                }

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
                new_answer_data[$scope.current_user.role + '_resolve_flag_required'] = false;

                rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                    .then(rgiDocumentMethodSrvc.updateDocument(new_doc_data))
                    .then(rgiUserMethodSrvc.updateUser(new_user_data))
                    .then(function () {
                        $rootScope.$broadcast('RESET_REFERENCE_ACTION');
                        $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
                        rgiNotifier.notify('Reference added!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                        $scope.disable_button = false;
                    }).finally($scope.closeThisDialog);
            }
        };

        $scope.closeDialog = function () {
            $scope.closeThisDialog();
            $rootScope.$broadcast('RESET_SELECTED_REFERENCE_ACTION');
        };
    }]);
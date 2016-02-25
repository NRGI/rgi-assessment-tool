'use strict';

angular.module('app')
    .controller('rgiEditDocumentDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiNotifier,
        rgiDocumentSrvc,
        rgiDocumentMethodSrvc,
        rgiIdentitySrvc
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.new_doc_data = $scope.$parent.document;

        $scope.doc_type = [
            {value: 'book', text: 'Book'},
            {value: 'book_section', text: 'Book Chapter'},
            {value: 'bill', text: 'Bill'},
            {value: 'data_file', text: 'Data File'},
            {value: 'generic', text: 'Generic'},
            {value: 'journal', text: 'Journal'},
            {value: 'case', text: 'Judicial Decision'},
            {value: 'magazine_article', text: 'Magazine Article'},
            {value: 'newspaper_article', text: 'Newspaper Article'},
            {value: 'parliamentary_meeting_note', text: 'Parliamentary meeting notes'},
            {value: 'policy_document', text: 'Policy document'},
            {value: 'report', text: 'Report'},
            {value: 'statute', text: 'Statute'},
            {value: 'web_page', text: 'Web Page'},
            {value: 'working_paper', text: 'Working Paper'}
        ];
        $scope.authorPush = function () {
            $scope.new_doc_data.authors.push({first_name: "", last_name: ""});
        };

        $scope.editorPush = function () {
            $scope.new_doc_data.editors.push({first_name: "", last_name: ""});
        };

        $scope.authorPop = function (index) {
            $scope.new_doc_data.authors.splice(index, 1);
        };

        $scope.editorPop = function (index) {
            $scope.new_doc_data.editors.splice(index, 1);
        };

        $scope.documentSave = function (new_doc_data) {
            //check for minimum data
            if (!$scope.new_doc_data.title) {
                rgiNotifier.error('You must provide a title!');
            } else if (!$scope.new_doc_data.type) {
                rgiNotifier.error('You must provide a document type!');
            } else if (!$scope.new_doc_data.publisher && (!$scope.new_doc_data.authors[0].first_name || !$scope.new_doc_data.authors[0].last_name)) {
                rgiNotifier.error('You must provide either a publisher or an author!');
            } else if (!$scope.new_doc_data.year) {
                rgiNotifier.error('You must provide the year of publication!');
            } else {
                rgiDocumentMethodSrvc.updateDocument(new_doc_data).then(function () {
                    // TODO fix save notification
                    rgiNotifier.notify('Document has been updated');
                    ngDialog.close();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
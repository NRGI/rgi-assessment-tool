'use strict';

angular.module('app')
    .controller('rgiEditDocumentDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiDocumentMethodSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.new_doc_data = $scope.$parent.document;

        $scope.doc_type = [
            {value: 'journal', text: 'Journal'},
            {value: 'data_file', text: 'Data File'},
            {value: 'book', text: 'Book'},
            {value: 'generic', text: 'Generic'},
            {value: 'book_section', text: 'Book Section'},
            {value: 'conference_proceedings', text: 'Conference Proceedings'},
            {value: 'working_paper', text: 'Working Paper'},
            {value: 'report', text: 'Report'},
            {value: 'web_page', text: 'Web Page'},
            {value: 'thesis', text: 'Thesis'},
            {value: 'magazine_article', text: 'Magazine Article'},
            {value: 'statute', text: 'Statute'},
            {value: 'patent', text: 'Patent'},
            {value: 'parliamentary_meeting_note', text: 'Parliamentary meeting notes'},
            {value: 'newspaper_article', text: 'Newspaper Article'},
            {value: 'policy_document', text: 'Policy document'},
            {value: 'computer_program', text: 'Computer Program'},
            {value: 'hearing', text: 'Hearing'},
            {value: 'television_broadcast', text: 'Television Broadcast'},
            {value: 'encyclopedia_article', text: 'Encyclopedia Article'},
            {value: 'case', text: 'Case'},
            {value: 'film', text: 'Film'},
            {value: 'statute', text: 'Statute'},
            {value: 'bill', text: 'Bill'}
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

        $scope.documentSave = function (docData) {
            //check for minimum data
            if (!docData.title) {
                rgiNotifier.error('You must provide a title!');
            } else if (!docData.type) {
                rgiNotifier.error('You must provide a document type!');
            } else if (!docData.publisher && (!docData.authors[0].first_name || !docData.authors[0].last_name)) {
                rgiNotifier.error('You must provide either a publisher or an author!');
            } else if (!docData.year) {
                rgiNotifier.error('You must provide the year of publication!');
            } else {
                if (docData.source && (['http', 'https'].indexOf(docData.source.split('://')[0]) === -1)) {
                    docData.source = 'http://' + docData.source;
                }

                rgiDocumentMethodSrvc.updateDocument(docData).then(function () {
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

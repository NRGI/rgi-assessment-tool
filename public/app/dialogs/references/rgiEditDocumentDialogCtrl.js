'use strict';

angular.module('app')
    .controller('rgiEditDocumentDialogCtrl', function (
        $scope,
        $route,
        rgiDocumentMethodSrvc,
        rgiNotifier
    ) {
        $scope.new_doc_data = $scope.$parent.document;

        $scope.doc_type = [
            {value: 'bill', text: 'Bill'},
            {value: 'book', text: 'Book'},
            {value: 'book_section', text: 'Book Section'},
            {value: 'case', text: 'Case'},
            {value: 'computer_program', text: 'Computer Program'},
            {value: 'conference_proceedings', text: 'Conference Proceedings'},
            {value: 'data_file', text: 'Data File'},
            {value: 'encyclopedia_article', text: 'Encyclopedia Article'},
            {value: 'film', text: 'Film'},
            {value: 'generic', text: 'Generic'},
            {value: 'hearing', text: 'Hearing'},
            {value: 'journal', text: 'Journal'},
            {value: 'magazine_article', text: 'Magazine Article'},
            {value: 'newspaper_article', text: 'Newspaper Article'},
            {value: 'parliamentary_meeting_note', text: 'Parliamentary meeting notes'},
            {value: 'patent', text: 'Patent'},
            {value: 'policy_document', text: 'Policy document'},
            {value: 'report', text: 'Report'},
            {value: 'statute', text: 'Statute'},
            {value: 'television_broadcast', text: 'Television Broadcast'},
            {value: 'thesis', text: 'Thesis'},
            {value: 'web_page', text: 'Web Page'},
            {value: 'working_paper', text: 'Working Paper'}
        ];

        $scope.addAuthor = function () {
            $scope.new_doc_data.authors.push({first_name: "", last_name: ""});
        };

        $scope.addEditor = function () {
            $scope.new_doc_data.editors.push({first_name: "", last_name: ""});
        };

        $scope.deleteAuthor = function (index) {
            $scope.new_doc_data.authors.splice(index, 1);
        };

        $scope.deleteEditor = function (index) {
            $scope.new_doc_data.editors.splice(index, 1);
        };

        $scope.saveDocument = function (docData) {
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
                    $scope.closeThisDialog();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
            }
        };
    });

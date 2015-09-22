'use strict';
//var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiEditDocumentDialogCtrl', function ($scope, $route, ngDialog, rgiNotifier, rgiDocumentSrvc, rgiDocumentMethodSrvc) {
    $scope.new_doc_data = $scope.$parent.document;

    $scope.doc_type = [
        {value: 'journal', text: 'Journal'},
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
        {value: 'newspaper_article', text: 'Newspaper Article'},
        {value: 'computer_program', text: 'Computer Program'},
        {value: 'hearing', text: 'Hearing'},
        {value: 'television_broadcast', text: 'Television Broadcast'},
        {value: 'encyclopedia_article', text: 'Encyclopedia Article'},
        {value: 'case', text: 'Case'},
        {value: 'film', text: 'Film'},
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

    $scope.documentSave = function (new_doc_data) {
        rgiDocumentMethodSrvc.updateDocument(new_doc_data).then(function () {
            // TODO fix save notification
            rgiNotifier.notify('Document has been updated');
            ngDialog.close();
        }, function (reason) {
            rgiNotifier.error(reason);
        });
        //if (new_doc_data.authors[0].first_name === "" || new_doc_data.authors[0].last_name === "" || !new_doc_data.title || !new_doc_data.type) {
        //    rgiNotifier.error('You must provide at least a title, author and publication type!')
        //} else {
        //
        //    if (new_doc_data.status === 'created') {
        //        new_doc_data.status = 'submitted';
        //    }
        //    rgiDocumentMethodSrvc.updateDocument(new_doc_data).then(function () {
        //        rgiNotifier.notify('Document has been updated');
        //        ngDialog.close();
        //    }, function (reason) {
        //        rgiNotifier.error(reason);
        //    });
        //}

    };

    $scope.closeDialog = function () {
        ngDialog.close();
    };
});

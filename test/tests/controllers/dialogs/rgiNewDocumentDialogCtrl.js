/*jslint node: true */
'use strict';

describe('rgiNewDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog;

    beforeEach(inject(function ($rootScope, $controller, _ngDialog_) {
        ngDialog = _ngDialog_;

        $scope = $rootScope.$new();
        $scope.new_document = {status: 'created'};

        $controller('rgiNewDocumentDialogCtrl', {$scope: $scope});
    }));

    it('defines available document types', function () {
        _.isEqual($scope.new_doc_type, [
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
        ]).should.be.equal(true);
    });

    it('initializes document authors', function () {
        _.isEqual($scope.new_document.authors, [{first_name: '', last_name: ''}]).should.be.equal(true);
    });

    it('initializes document editors', function () {
        _.isEqual($scope.new_document.editors, [{first_name: '', last_name: ''}]).should.be.equal(true);
    });

    describe('#authorPush', function() {
        it('pushes an empty author record', function () {
            $scope.authorPush();
            _.isEqual($scope.new_document.authors[$scope.new_document.authors.length - 1], {first_name: '', last_name: ''}).should.be.equal(true);
        });
    });

    describe('#editorPush', function() {
        it('pushes an empty editor record', function () {
            $scope.editorPush();
            _.isEqual($scope.new_document.editors[$scope.new_document.editors.length - 1], {first_name: '', last_name: ''}).should.be.equal(true);
        });
    });

    describe('#authorPop', function() {
        it('pops author record from a given index', function () {
            $scope.new_document.authors = [
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Dennis', last_name: 'Ritchie'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ];

            $scope.authorPop(1);

            _.isEqual($scope.new_document.authors, [
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ]).should.be.equal(true);
        });
    });

    describe('#editorPop', function() {
        it('pops author record from a given index', function () {
            $scope.new_document.editors = [
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Dennis', last_name: 'Ritchie'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ];

            $scope.editorPop(1);

            _.isEqual($scope.new_document.editors, [
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ]).should.be.equal(true);
        });
    });

    describe('#closeDialog', function() {
        it('closes the dialog', function () {
            var dialogMock = sinon.mock(ngDialog);
            dialogMock.expects('close');

            $scope.closeDialog();

            dialogMock.verify();
            dialogMock.restore();
        });
    });
});

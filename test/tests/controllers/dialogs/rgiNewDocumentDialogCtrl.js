/*jslint node: true */
'use strict';

describe('rgiNewDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog;

    beforeEach(inject(function ($rootScope, $controller, _ngDialog_) {
        ngDialog = _ngDialog_;

        $scope = $rootScope.$new();
        $scope.new_document = {status: 'created'};
        $scope.$parent = {
            new_document: {
                status: 'created',
                authors: [{first_name: 'Author First Name', last_name: 'Author Last Name'}],
                editors: [{first_name: 'Editor First Name', last_name: 'Editor Last Name'}]
            }
        };

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

    it('copies the document authors from the parent scope', function () {
        $scope.new_document.authors.should.deep.equal([{
            first_name: $scope.$parent.new_document.authors[0].first_name,
            last_name: $scope.$parent.new_document.authors[0].last_name
        }]);
    });

    it('copies the document editors from the parent scope', function () {
        $scope.new_document.editors.should.deep.equal([{
            first_name: $scope.$parent.new_document.editors[0].first_name,
            last_name: $scope.$parent.new_document.editors[0].last_name
        }]);
    });

    describe('#authorPush', function() {
        it('pushes an empty author record', function () {
            $scope.authorPush();
            $scope.new_document.authors[$scope.new_document.authors.length - 1].should.deep.equal({first_name: '', last_name: ''});
        });
    });

    describe('#editorPush', function() {
        it('pushes an empty editor record', function () {
            $scope.editorPush();
            $scope.new_document.editors[$scope.new_document.editors.length - 1].should.deep.equal({first_name: '', last_name: ''});
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

            $scope.new_document.authors.should.deep.equal([
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ]);
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

            $scope.new_document.editors.should.deep.equal([
                {first_name: 'Brian', last_name: 'Kernighan'},
                {first_name: 'Bjarne', last_name: 'Stroustrup'}
            ]);
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

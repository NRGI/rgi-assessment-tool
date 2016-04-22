/*jslint node: true */
'use strict';

describe('rgiNewDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, ngDialog;

    beforeEach(inject(function ($controller, _$rootScope_, _ngDialog_) {
        ngDialog = _ngDialog_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();

        $scope.new_document = {status: 'created'};
        $scope.answer = {};
        $scope.closeThisDialog = sinon.spy();

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
        $scope.new_doc_type.should.deep.equal([
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
        ]);
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

    describe('#closeDialog', function() {
        it('closes the dialog', function () {
            var $rootScopeMock = sinon.mock($rootScope);
            $rootScopeMock.expects('$broadcast').withArgs('RESET_SELECTED_REFERENCE_ACTION');

            $scope.closeDialog();

            $scope.closeThisDialog.called.should.be.equal(true);
            $rootScopeMock.verify();
            $rootScopeMock.restore();
        });
    });
});

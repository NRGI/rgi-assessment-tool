'use strict';

describe('rgiEditDocumentDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, rgiNotifier, rgiDocumentMethodSrvc, DOCUMENT = 'ORIGINAL DOCUMENT';

    beforeEach(inject(
        function ($rootScope, $controller, _$route_, _rgiNotifier_, _rgiDocumentMethodSrvc_) {
            $route = _$route_;
            rgiNotifier = _rgiNotifier_;
            rgiDocumentMethodSrvc = _rgiDocumentMethodSrvc_;

            $scope = $rootScope.$new();
            $scope.$parent = {document: DOCUMENT};
            $controller('rgiEditDocumentDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets the document data', function() {
        $scope.new_doc_data.should.be.equal(DOCUMENT);
    });

    it('initializes the document type list', function() {
        $scope.doc_type.should.deep.equal([
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
        ]);
    });

    describe('#addAuthor', function() {
        it('adds author full name to the authors list', function() {
            $scope.new_doc_data = {authors: []};
            $scope.addAuthor();
            $scope.new_doc_data.authors.should.deep.equal([{first_name: '', last_name: ''}]);
        });
    });

    describe('#deleteAuthor', function() {
        it('removes author by the specified index', function() {
            $scope.new_doc_data = {authors: [
                {first_name: 'Julia', last_name: 'Roberts'},
                {first_name: 'Joel', last_name: 'Cohen'},
                {first_name: 'Eric', last_name: 'Roberts'}
            ]};

            $scope.deleteAuthor(1);

            $scope.new_doc_data.authors.should.deep.equal([
                {first_name: 'Julia', last_name: 'Roberts'},
                {first_name: 'Eric', last_name: 'Roberts'}
            ]);
        });
    });

    describe('#addEditor', function() {
        it('adds editor full name to the editors list', function() {
            $scope.new_doc_data = {editors: []};
            $scope.addEditor();
            $scope.new_doc_data.editors.should.deep.equal([{first_name: '', last_name: ''}]);
        });
    });

    describe('#deleteEditor', function() {
        it('removes editor by the specified index', function() {
            $scope.new_doc_data = {editors: [
                {first_name: 'Julia', last_name: 'Roberts'},
                {first_name: 'Joel', last_name: 'Cohen'},
                {first_name: 'Eric', last_name: 'Roberts'}
            ]};

            $scope.deleteEditor(1);

            $scope.new_doc_data.editors.should.deep.equal([
                {first_name: 'Julia', last_name: 'Roberts'},
                {first_name: 'Eric', last_name: 'Roberts'}
            ]);
        });
    });

    describe('#saveDocument', function() {
        var mocks = {};

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        describe('INCOMPLETE DATA CASE', function() {
            it('shows an error message if the title is not set', function() {
                $scope.new_doc_data = {title: undefined};
                mocks.notifier.expects('error').withArgs('You must provide a title!');
            });

            it('shows an error message if the title is not set', function() {
                $scope.new_doc_data = {title: 'TITLE', type: undefined};
                mocks.notifier.expects('error').withArgs('You must provide a document type!');
            });

            it('shows an error message if no publisher either author first name is set', function() {
                $scope.new_doc_data = {
                    title: 'TITLE',
                    type: 'TYPE',
                    publisher: false,
                    authors: [{first_name: undefined}]
                };
                mocks.notifier.expects('error').withArgs('You must provide either a publisher or an author!');
            });

            it('shows an error message if no publisher either author last name is set', function() {
                $scope.new_doc_data = {
                    title: 'TITLE',
                    type: 'TYPE',
                    publisher: false,
                    authors: [{first_name: 'FIRST NAME', last_name: undefined}]
                };
                mocks.notifier.expects('error').withArgs('You must provide either a publisher or an author!');
            });

            it('shows an error message if the year of publication is not set', function() {
                $scope.new_doc_data = {
                    title: 'TITLE',
                    type: 'TYPE',
                    publisher: true,
                    authors: [{first_name: 'FIRST NAME', last_name: 'LAST NAME'}],
                    year: false
                };
                mocks.notifier.expects('error').withArgs('You must provide the year of publication!');
            });

            afterEach(function() {
                $scope.saveDocument($scope.new_doc_data);
                mocks.notifier.verify();
            });
        });

        describe('COMPLETE DATA CASE', function() {
            var documentMethodUpdateDocumentSpy, documentMethodUpdateDocumentStub,
                setStub = function(callback) {
                    documentMethodUpdateDocumentSpy = sinon.spy(function() {
                        return {then: callback};
                    });

                    documentMethodUpdateDocumentStub = sinon.stub(rgiDocumentMethodSrvc, 'updateDocument',
                        documentMethodUpdateDocumentSpy);
                };

            beforeEach(function() {
                $scope.closeThisDialog = sinon.spy();

                $scope.new_doc_data = {
                    title: 'TITLE',
                    type: 'TYPE',
                    publisher: true,
                    authors: [{first_name: 'FIRST NAME', last_name: 'LAST NAME'}],
                    year: true
                };
            });

            describe('SUCCESS CASE', function() {
                beforeEach(function() {
                    setStub(function(callback) {
                        callback();
                    });

                    mocks.notifier.expects('notify').withArgs('Document has been updated');
                    $scope.saveDocument($scope.new_doc_data);
                });

                it('closes the dialog', function() {
                    $scope.closeThisDialog.called.should.be.equal(true);
                });

                it('shows a notification message', function() {
                    mocks.notifier.verify();
                });
            });

            describe('FAILURE CASE', function() {
                it('shows the failure reason', function() {
                    var FAILURE_REASON = 'FAILURE REASON';

                    setStub(function(callbackSuccess, callbackFailure) {
                        callbackFailure(FAILURE_REASON);
                    });

                    mocks.notifier.expects('error').withArgs(FAILURE_REASON);
                    $scope.saveDocument($scope.new_doc_data);
                    mocks.notifier.verify();
                });
            });

            describe('SOURCE CHANGE', function() {
                beforeEach(function() {
                    setStub(function(callback) {
                        callback();
                    });
                });

                it('adds protocol to the source if the protocol is not set', function() {
                    $scope.new_doc_data.source = 'google.com';
                    $scope.saveDocument($scope.new_doc_data);
                    $scope.new_doc_data.source.should.be.equal('http://google.com');
                });

                it('does not modify the source protocol if the protocol is set to `http`', function() {
                    $scope.new_doc_data.source = 'http://google.com';
                    $scope.saveDocument($scope.new_doc_data);
                    $scope.new_doc_data.source.should.be.equal('http://google.com');
                });

                it('does not modify the source protocol if the protocol is set to `https`', function() {
                    $scope.new_doc_data.source = 'https://google.com';
                    $scope.saveDocument($scope.new_doc_data);
                    $scope.new_doc_data.source.should.be.equal('https://google.com');
                });
            });

            afterEach(function() {
                documentMethodUpdateDocumentSpy.withArgs($scope.new_doc_data).called.should.be.equal(true);
            });
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].restore();
            });
        });
    });
});

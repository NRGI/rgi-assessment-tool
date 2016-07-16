'use strict';

describe('rgiDocumentTableCtrl', function () {
    beforeEach(module('app'));
    var $scope, args = {}, callbacks = {}, mocks = {}, spies = {}, stubs = {},
        rgiDialogFactory, rgiDocumentSrvc;

    beforeEach(inject(function (
        $rootScope,
        $controller,
        _rgiDialogFactory_,
        _rgiDocumentSrvc_,
        rgiAssessmentSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier
    ) {
        rgiDialogFactory = _rgiDialogFactory_;
        rgiDocumentSrvc = _rgiDocumentSrvc_;
        $scope = $rootScope.$new();

        $scope.$watch = sinon.spy(function(variableName, callback) {
            callbacks.scopeWatch = callback;
            args.scopeWatch = variableName;
        });

        stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc, 'getDefaultHandler',
            function(errorMessage) {return errorMessage;});

        spies.assessmentQuery = sinon.spy(function(criteria, callback) {
            callbacks.assessmentQuery = callback;
            args.assessmentQuery = criteria;
        });
        stubs.assessmentQuery = sinon.stub(rgiAssessmentSrvc, 'query', spies.assessmentQuery);

        mocks.notifier = sinon.mock(rgiNotifier);
        $controller('rgiDocumentTableCtrl', {$scope: $scope});
    }));

    it('resets the `busy` flag', function() {
        $scope.busy.should.be.equal(false);
    });

    it('initializes the assessment filter options', function() {
        $scope.assessment_filter_options.should.deep.equal([]);
    });

    it('sets the assessment filter value', function() {
        $scope.assessment_filter.should.be.equal('');
    });

    describe('LOAD ASSESSMENTS DATA', function() {
        it('sends requests with empty criteria to get assessments', function() {
            args.assessmentQuery.should.deep.equal({});
        });

        it('shows an error if a failure occurred', function() {
            mocks.notifier.expects('error').withArgs('No assessments');
            callbacks.assessmentQuery({reason: true});
            mocks.notifier.verify();
        });

        it('supplements the assessment filter options if no failure occurs', function() {
            callbacks.assessmentQuery([{
                assessment_ID: 'AF-2001-PI',
                country: 'Afghanistan',
                year: 2001,
                version: 'Pilot'
            }]);

            $scope.assessment_filter_options.should.deep.equal([
                {value: 'AF-2001-PI', text: 'Afghanistan 2001 Pilot'}
            ]);
        });
    });

    var setDocumentQueryCachedStub = function() {
        spies.documentQueryCached = sinon.spy(function(searchOptions, callback, errorHandler) {
            callbacks.documentQueryCached = callback;
            args.errorHandler = errorHandler;
        });

        stubs.documentQueryCached = sinon.stub(rgiDocumentSrvc, 'queryCached', spies.documentQueryCached);
    };

    describe('$watch', function() {
        it('watches assessment filter', function() {
            args.scopeWatch.should.be.equal('assessment_filter');
        });

        describe('WATCH HANDLER', function() {
            beforeEach(setDocumentQueryCachedStub);

            describe('ALL ASSESSMENTS CASE', function() {
                beforeEach(function() {
                    callbacks.scopeWatch(false);
                });

                it('submits a request with search options to get documents', function() {
                    spies.documentQueryCached.withArgs({skip: 0, limit: 50}).called.should.be.equal(true);
                });

                it('processes HTTP failures', function() {
                    args.errorHandler.should.be.equal('Load document data failure');
                });

                describe('DOCUMENT QUERY HANDLER', function() {
                    describe('SUCCESS CASE', function() {
                        var DOCUMENTS, ITEMS_NUMBER = 113;

                        it('shows an error message if the response is empty', function() {
                            DOCUMENTS = [];
                            mocks.notifier.expects('error').withArgs('No documents uploaded');
                            callbacks.documentQueryCached({count: ITEMS_NUMBER, data: DOCUMENTS});
                            mocks.notifier.verify();
                        });

                        it('does not show an error message if the response is not empty', function() {
                            DOCUMENTS = ['doc'];
                            mocks.notifier.expects('error').withArgs('No documents uploaded').never();
                            callbacks.documentQueryCached({count: ITEMS_NUMBER, data: DOCUMENTS});
                            mocks.notifier.verify();
                        });

                        afterEach(function() {
                            $scope.count.should.be.equal(ITEMS_NUMBER);
                            $scope.documents.should.be.equal(DOCUMENTS);
                        });
                    });

                    it('shows an error message if a failure occurs', function() {
                        args.errorHandler.should.be.equal('Load document data failure');
                    });
                });
            });

            it('submits a request with search options and the assessment to get documents if an assessment is set', function() {
                var ASSESSMENT = 'AF-2016-PI';
                callbacks.scopeWatch(ASSESSMENT);
                spies.documentQueryCached.withArgs({skip: 0, limit: 50, assessments: ASSESSMENT}).called.should.be.equal(true);
            });
        });
    });

    describe('#loadMoreDocs', function() {
        var setStub = function(callback) {
            spies.documentQuery = sinon.spy(callback);
            stubs.documentQuery = sinon.stub(rgiDocumentSrvc, 'query', spies.documentQuery);
        };

        beforeEach(function() {
            setDocumentQueryCachedStub();
            callbacks.scopeWatch(false);

            setStub(function(searchOptions, callback, errorHandler) {
                args.documentQueryErrorHandler = errorHandler;
                callbacks.documentQuery = callback;
            });
        });

        describe('SEND A REQUEST TO GET MORE DOCS', function() {
            beforeEach(function() {
                callbacks.documentQueryCached({count: 51, data: []});
                $scope.loadMoreDocs();
            });

            it('sends a request to get more documents if not all documents are shown', function() {
                spies.documentQuery.withArgs({skip: 1, limit: 50}).called.should.be.equal(true);
            });

            it('processes HTTP failures', function() {
                args.documentQueryErrorHandler.should.be.equal('Load document data failure');
            });

            it('sets the `busy` flag', function() {
                $scope.busy.should.be.equal(true);
            });

            describe('HANDLER', function() {
                describe('SUCCESS CASE', function() {
                    beforeEach(function() {
                        $scope.documents = ['shown document'];
                        callbacks.documentQuery({data: ['new document']});
                    });

                    it('supplements the documents set', function() {
                        $scope.documents.should.deep.equal(['shown document', 'new document']);
                    });

                    it('resets the `busy` flag', function() {
                        $scope.busy.should.be.equal(false);
                    });
                });

                it('shows an error message if a failure occurred', function() {
                    mocks.notifier.expects('error').withArgs('Documents loading failure');
                    callbacks.documentQuery({reason: true});
                    mocks.notifier.verify();
                });
            });
        });

        it('sends a request including filtering criteria if the filtering criteria are set', function() {
            $scope.assessment_filter = 'KG-2016-MI';
            callbacks.documentQueryCached({count: 51, data: []});

            $scope.loadMoreDocs();
            spies.documentQuery.withArgs({skip: 1, limit: 50, assessments: $scope.assessment_filter})
                .called.should.be.equal(true);
        });

        it('does not send a request to get more documents if all documents are shown already', function() {
            callbacks.documentQueryCached({count: 1, data: []});
            $scope.loadMoreDocs();
            spies.documentQuery.notCalled.should.be.equal(true);
            $scope.busy.should.be.equal(true);
        });
    });

    describe('#deleteDocument', function() {
        it('opens a dialog', function() {
            var DOCUMENT = 'doc';
            mocks.dialogFactory = sinon.mock(rgiDialogFactory);
            mocks.dialogFactory.expects('deleteDocument').withArgs($scope, DOCUMENT);
            $scope.deleteDocument(DOCUMENT);
            mocks.dialogFactory.verify();
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        Object.keys(mocks).forEach(function(mockName) {
            mocks[mockName].restore();
        });
    });
});

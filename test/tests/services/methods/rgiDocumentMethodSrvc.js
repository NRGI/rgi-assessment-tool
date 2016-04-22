'use strict';

describe('rgiDocumentMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiDocumentMethodSrvc,
        rgiDocumentSrvc,
        resourceProcessorMock;

    beforeEach(inject(function (_rgiDocumentMethodSrvc_, _rgiDocumentSrvc_, rgiResourceProcessorSrvc) {
        rgiDocumentSrvc = _rgiDocumentSrvc_;
        rgiDocumentMethodSrvc = _rgiDocumentMethodSrvc_;
        resourceProcessorMock = sinon.mock(rgiResourceProcessorSrvc);
    }));

    describe('#deleteDocument', function () {
        it('submits a request on the document delete', function () {
            var docId = 'doc';
            resourceProcessorMock.expects('delete').withArgs(rgiDocumentSrvc, docId);
            rgiDocumentMethodSrvc.deleteDocument(docId);
        });
    });

    describe('#updateDocument', function () {
        it('submits a request on the document update', function () {
            var doc = 'doc';
            resourceProcessorMock.expects('process').withArgs(doc, '$update');
            rgiDocumentMethodSrvc.updateDocument(doc);
        });
    });

    afterEach(function () {
        resourceProcessorMock.verify();
        resourceProcessorMock.restore();
    });
});

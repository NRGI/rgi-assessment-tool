'use strict';

var describe, beforeEach, it, inject, expect;

describe('rgiDocumentSrvc', function () {
    var documentServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiDocumentSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        documentServiceInstance = new rgiDocumentSrvc();
    }));

    it('requests question data for a given `questionId`', function () {
        var documentId = 1;
        $httpBackend.expectGET('/api/documents/' + documentId).respond('');
        documentServiceInstance.$query({_id: documentId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});
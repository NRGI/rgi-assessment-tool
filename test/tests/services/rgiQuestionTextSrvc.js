'use strict';
/*jslint nomen: true newcap: true */
var describe, beforeEach, it, inject, expect;

describe('rgiQuestionTextSrvc', function () {
    var questionTextServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiQuestionTextSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        questionTextServiceInstance = new rgiQuestionTextSrvc();
    }));

    it('requests question text for a given `questionId`', function () {
        var questionId = 1;
        $httpBackend.expectGET('/api/question-text/' + questionId).respond('');
        questionTextServiceInstance.$get({_id: questionId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});
'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiUploadSrvc', function () {
    var uploadServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiUploadSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        uploadServiceInstance = new rgiUploadSrvc();
    }));

    it('requests upload data', function () {
        $httpBackend.expectGET('/file-upload').respond('');
        uploadServiceInstance.$get();
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});
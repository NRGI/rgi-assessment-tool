'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiUserListSrvc', function () {
    var userListServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiUserListSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        userListServiceInstance = new rgiUserListSrvc();
    }));

    it('requests user data for a given `userId`', function () {
        var userId = 1;
        $httpBackend.expectGET('/api/user-list/' + userId).respond('');
        userListServiceInstance.$get({_id: userId});
    });

    afterEach(function() {
        $httpBackend.flush();
    });
});
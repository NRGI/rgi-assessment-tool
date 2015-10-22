'use strict';
/*jshint -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiUserSrvc', function () {
    var userServiceInstance, $httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(rgiUserSrvc, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        userServiceInstance = new rgiUserSrvc();
    }));

    it('requests answer data for a given `answerId`', function () {
        var userId = 1;
        $httpBackend.expectGET('/api/users/' + userId).respond('');
        userServiceInstance.$get({_id: userId});
        $httpBackend.flush();
    });

    describe('#isSupervisor', function() {
        it('returns TRUE if the role is "supervisor"', function() {
            userServiceInstance.role = 'supervisor';
            userServiceInstance.isSupervisor().should.be.equal(true);
        });

        it('returns FALSE if the role is not "supervisor"', function() {
            userServiceInstance.role = 'nobody';
            userServiceInstance.isSupervisor().should.be.equal(false);
        });
    });

    describe('#isReviewer', function() {
        it('returns TRUE if the role is "reviewer"', function() {
            userServiceInstance.role = 'reviewer';
            userServiceInstance.isReviewer().should.be.equal(true);
        });

        it('returns FALSE if the role is not "reviewer"', function() {
            userServiceInstance.role = 'nobody';
            userServiceInstance.isReviewer().should.be.equal(false);
        });
    });

    describe('#isResearcher', function() {
        it('returns TRUE if the role is "researcher"', function() {
            userServiceInstance.role = 'researcher';
            userServiceInstance.isResearcher().should.be.equal(true);
        });

        it('returns FALSE if the role is not "researcher"', function() {
            userServiceInstance.role = 'nobody';
            userServiceInstance.isResearcher().should.be.equal(false);
        });
    });
});
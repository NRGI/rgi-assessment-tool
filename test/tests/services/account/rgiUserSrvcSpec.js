'use strict';
/*jshint -W030, -W079 */

var describe, beforeEach, it, inject, expect;

describe('rgiUserSrvcSpec', function () {
    beforeEach(module('app'));

    describe('isSupervisor', function () {
        it('should return false if the role is not a supervisor entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'not supervisor';
            expect(user.isSupervisor()).to.be.false;
        }));

        it('should return true if the role is a supervisor entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'supervisor';
            expect(user.isSupervisor()).to.be.true;
        }));
    });

    describe('isResearcher', function () {
        it('should return false if the role is not a researcher entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'not researcher';
            expect(user.isResearcher()).to.be.falsey;
        }));

        it('should return true if the role is a researcher entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'researcher';
            expect(user.isResearcher()).to.be.true;
        }));
    });

    describe('isReviewer', function () {
        it('should return false if the role is not a reviewer entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'not reviewer';
            expect(user.isReviewer()).to.be.falsey;
        }));

        it('should return true if the role is a reviewer entry', inject(function (rgiUserSrvc) {
            var user = new rgiUserSrvc();
            user.role = 'reviewer';
            expect(user.isReviewer()).to.be.true;
        }));
    });
});
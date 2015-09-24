'use strict';
/*jshint -W079 */

var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiDocumentAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, rgiDocumentSrvc, rgiUserListSrvc;
    var documentQueryStub, documentQuerySpy;
    var userListGetStub, userListGetSpy;
    var documents = [
        {
            users: ['user-id-1']
        },
        {
            users: ['super-user-id', 'user-id-2']
        }
    ];

    beforeEach(inject(
        function ($rootScope, $controller, _rgiDocumentSrvc_, _rgiUserListSrvc_) {
            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiUserListSrvc = _rgiUserListSrvc_;

            $scope = $rootScope.$new();

            documentQuerySpy = sinon.spy(function(object, callback) {
                callback(documents);
            });
            documentQueryStub = sinon.stub(rgiDocumentSrvc, 'query', documentQuerySpy);

            userListGetSpy = sinon.spy(function(criterion, callback) {
                callback(criterion._id.replace('-id', ''));
            });
            userListGetStub = sinon.stub(rgiUserListSrvc, 'get', userListGetSpy);

            $controller('rgiDocumentAdminCtrl', {$scope: $scope});
        }
    ));

    it('loads the sorting options', function () {
        _.isEqual([
            {value: 'title', text: 'Sort by document title'},
            {value: 'type', text: 'Sort by document type'},
            {value: 'assessments', text: 'Sort by attached assessments'}
        ], $scope.sort_options).should.be.equal(true);
    });

    it('sets the sorting order', function () {
        $scope.sort_order.should.be.equal('title');
    });

    it('loads document data', function () {
        _.isEqual([
            {
                users: ['user-id-1'],
                user_list: ['user-1']
            },
            {
                users: ['super-user-id', 'user-id-2'],
                user_list: ['super-user', 'user-2']
            }
        ], $scope.documents).should.be.equal(true);
    });

    afterEach(function () {
        documentQueryStub.restore();
        userListGetStub.restore();
    });
});

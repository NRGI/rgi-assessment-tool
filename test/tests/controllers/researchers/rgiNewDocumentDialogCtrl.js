//TODO move this to dialogs
//'use strict';
///*jslint nomen: true newcap: true */
//var describe, beforeEach, afterEach, it, inject, expect, sinon;
//
//describe('rgiNewDocumentDialogCtrl', function () {
//    beforeEach(module('app'));
//
//    var $scope, rgiAnswerSrvc, $routeParams, ngDialog, FileUploader;
//    var answerGetStub, answerGetSpy;
//    var questionId = 'QUESTION-ID';
//    var answer_ID = 'ANSWER-ID', $routeParamsAnswer_ID;
//
//    beforeEach(inject(
//        function ($rootScope, $controller, _$routeParams_, _ngDialog_, _rgiAnswerSrvc_, _FileUploader_) {
//            $routeParams = _$routeParams_;
//            ngDialog = _ngDialog_;
//            rgiAnswerSrvc = _rgiAnswerSrvc_;
//            FileUploader = _FileUploader_;
//
//            answerGetSpy = sinon.spy(function() {
//                return {_id: questionId};
//            });
//            answerGetStub = sinon.stub(rgiAnswerSrvc, 'get', answerGetSpy);
//
//            $routeParamsAnswer_ID = $routeParams.answer_ID;
//            $routeParams.answer_ID = answer_ID;
//
//            $scope = $rootScope.$new();
//
//            $controller('rgiNewDocumentDialogCtrl', {$scope: $scope});
//        }
//    ));
//
//    describe('#closeDialog', function() {
//        it('closes the dialog', function () {
//            var ngDialogMock = sinon.mock(ngDialog);
//            ngDialogMock.expects('close');
//
//            $scope.closeDialog();
//
//            ngDialogMock.verify();
//            ngDialogMock.restore();
//        });
//    });
//
//    afterEach(function () {
//        $routeParams.answer_ID = $routeParamsAnswer_ID;
//        answerGetStub.restore();
//    });
//});

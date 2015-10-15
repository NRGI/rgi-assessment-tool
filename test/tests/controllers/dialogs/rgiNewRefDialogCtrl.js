/*jslint node: true */
'use strict';

describe('rgiDeleteQuestionDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $timeout, rgiNotifier, rgiRequestSubmitterSrvc;
    var ANSWER = 'ANSWER', now;

    beforeEach(inject(
        function ($rootScope, $controller, _$timeout_, _rgiNotifier_, _rgiRequestSubmitterSrvc_) {
            $timeout = _$timeout_;
            rgiNotifier = _rgiNotifier_;
            rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;

            $scope = $rootScope.$new();
            $scope.$parent.answer = ANSWER;

            now = new Date();
            $controller('rgiNewRefDialogCtrl', {$scope: $scope});
        }
    ));

    it('resets file upload status', function () {
        $scope.fileUploading.should.be.equal(false);
    });

    it('copies answer from the parent scope', function () {
        $scope.answer_update.should.be.equal(ANSWER);
    });

    it('resets file URL', function () {
        $scope.fileUrl.should.be.equal('');
    });

    it('sets date format', function () {
        $scope.date_format.should.be.equal('MMMM d, yyyy');
    });

    var compareDates = function(date1, date2) {
        return Math.abs(date1.getTime() - date2.getTime()) < 300;
    };

    it('sets default date', function () {
        compareDates($scope.date_default, now).should.be.equal(true);
    });

    it('sets date limit', function () {
        compareDates($scope.date_max_limit, now).should.be.equal(true);
    });

    describe('#closeDialog', function () {
        it('closes the dialog', function () {
            var ngDialogMock = sinon.mock(rgiNotifier);
            $scope.closeDialog();
            ngDialogMock.verify();
            ngDialogMock.restore();
        });

        it('clears reference selection', function () {
            $scope.closeDialog();
            $scope.$parent.ref_selection.should.be.equal('');
        });
    });

    describe('#uploadFileByUrl', function () {
        it('sets file uploading flag while the file is uploading', function () {
            $scope.uploadFileByUrl();
            $scope.fileUploading.should.be.equal(true);
        });

        describe('REQUEST PROCESSING', function() {
            var requestSubmitterGetStub, requestSubmitterGetSpy;

            var uploadFile = function(response) {
                requestSubmitterGetSpy = sinon.spy(function() {
                    return {
                        then: function(callback) {
                            if(response !== undefined) {
                                callback(response);
                            }
                        }
                    };
                });

                requestSubmitterGetStub = sinon.stub(rgiRequestSubmitterSrvc, 'get', requestSubmitterGetSpy);
                $scope.uploadFileByUrl();
            };

            it('submits file URL to the server', function () {
                var FILE_URL = 'http://domain.com/file.txt';
                $scope.fileUrl = FILE_URL;

                uploadFile();

                requestSubmitterGetSpy.withArgs('/api/remote-file-upload?url=' + encodeURIComponent(FILE_URL))
                    .called.should.be.equal(true);
            });

            describe('FAILURE CASE', function() {
                var REASON = 'REASON', notifierErrorStub, notifierErrorSpy;

                beforeEach(function() {
                    notifierErrorSpy = sinon.spy();
                    notifierErrorStub = sinon.stub(rgiNotifier, 'error', notifierErrorSpy);

                    uploadFile({
                        data: {reason: REASON}
                    });
                });

                it('unsets file uploading flag', function () {
                    $scope.fileUploading.should.be.equal(false);
                });

                it('shows an error message', function () {
                    notifierErrorSpy.withArgs('The file cannot be uploaded').called.should.be.equal(true);
                });

                afterEach(function() {
                    notifierErrorStub.restore();
                });
            });

            describe('SUCCESS CASE', function() {
                var FILE_URL = 'http://domain.com/file.txt';
                var SIZE = 1024, ID = 'ID',
                    generateResponse = function(completion) {
                        return {
                            data: {
                                size: SIZE,
                                _id: ID,
                                completion: completion
                            }
                        };
                    };

                beforeEach(function() {
                    $scope.fileUrl = FILE_URL;
                });

                it('adds an item to the file queue', function () {
                    uploadFile(generateResponse(0.5));
                    _.isEqual($scope.uploader.queue[$scope.uploader.queue.length - 1], {
                        file: {
                            name: 'file.txt',
                            size: SIZE
                        },
                        isUploading: true,
                        progress: 50
                    }).should.be.equal(true);
                });

                describe('INCOMPLETE CASE', function() {
                    it('polls the server for uploading progress', function() {
                        uploadFile(generateResponse(0.5));
                        $timeout.flush();
                        requestSubmitterGetSpy.withArgs('/api/remote-file/upload-progress/' + ID).called.should.be.equal(true);
                    });
                });

                describe('COMPLETE CASE', function() {
                    var uploaderMock;

                    beforeEach(function() {
                        uploaderMock = sinon.mock($scope.uploader);
                        uploaderMock.expects('onCompleteItem');
                        uploadFile(generateResponse(1));
                    });

                    it('unsets file uploading flag', function () {
                        $scope.fileUploading.should.be.equal(false);
                    });

                    afterEach(function() {
                        uploaderMock.verify();
                        uploaderMock.restore();
                    });
                });
            });

            afterEach(function() {
                requestSubmitterGetStub.restore();
            });
        });

    });
});

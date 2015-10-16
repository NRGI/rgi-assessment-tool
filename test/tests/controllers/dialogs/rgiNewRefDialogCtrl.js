/*jslint node: true */
'use strict';

describe('rgiDeleteQuestionDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $timeout, ngDialog, rgiNotifier, rgiFileUploaderSrvc, rgiRequestSubmitterSrvc,
        fileUploaderGetStub, fileUploaderGetSpy,
        ANSWER = 'ANSWER', now;

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$timeout_,
            _ngDialog_,
            _rgiNotifier_,
            _rgiFileUploaderSrvc_,
            _rgiRequestSubmitterSrvc_) {
            $timeout = _$timeout_;
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiFileUploaderSrvc = _rgiFileUploaderSrvc_;
            rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;

            $scope = $rootScope.$new();
            $scope.$parent.answer = ANSWER;

            fileUploaderGetSpy = sinon.spy(function() {
                return {queue: [], filters: []};
            });
            fileUploaderGetStub = sinon.stub(rgiFileUploaderSrvc, 'get', fileUploaderGetSpy);

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

    it('initializes file uploader', function() {
        fileUploaderGetSpy.withArgs({isHTML5: true, withCredentials: true, url: 'file-upload'}).called.should.be.equal(true);
    });

    it('adds uploader filter', function() {
        var filter = $scope.uploader.filters[$scope.uploader.filters.length - 1];

        var emptyQueue = {queue: [], fn: filter.fn};
        emptyQueue.fn().should.be.equal(true);

        var nonEmptyQueue = {queue: [1], fn: filter.fn};
        nonEmptyQueue.fn().should.be.equal(false);

        filter.name.should.be.equal('customFilter');
    });

    describe('#uploader.onCompleteItem', function () {
        var RESPONSE = 'RESPONSE';

        it('cleans the queue', function () {
            $scope.uploader.onCompleteItem();
            $scope.uploader.queue.length.should.be.equal(0);
        });

        it('shows an error message if error status received', function () {
            var REASON = 'REASON',
                notifierMock = sinon.mock(rgiNotifier);

            notifierMock.expects('error').withArgs(REASON);
            $scope.uploader.onCompleteItem(null, {reason: REASON}, 400);

            notifierMock.verify();
            notifierMock.restore();
        });

        describe('SUCCESS CASE', function() {
            beforeEach(function() {
                $scope.uploader.onCompleteItem(null, RESPONSE, 200);
            });

            it('sets the document got from the response', function () {
                $scope.new_document.should.be.equal(RESPONSE);
            });

            it('sets the value to true', function () {
                $scope.value.should.be.equal(true);
            });
        });

        describe('DIALOGS ON SUCCESS', function() {
            var dialogMock;

            beforeEach(function() {
                dialogMock = sinon.mock(ngDialog);
            });

            it('closes the file upload dialog', function () {
                dialogMock.expects('close').withArgs('ngdialog1');
            });

            it('opens a new document dialog', function () {
                var dialogScope = $scope.$parent;
                dialogScope.new_document = $scope.new_document;

                dialogMock.expects('open').withArgs({
                    template: 'partials/dialogs/new-document-dialog',
                    controller: 'rgiNewDocumentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    scope: dialogScope
                });
            });

            afterEach(function() {
                $scope.uploader.onCompleteItem(null, RESPONSE, 200);
                dialogMock.verify();
                dialogMock.restore();
            });
        });
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

    afterEach(function() {
        fileUploaderGetStub.restore();
    });
});

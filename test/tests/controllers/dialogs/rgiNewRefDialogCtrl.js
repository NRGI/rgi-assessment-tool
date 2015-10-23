/*jslint node: true */
'use strict';

describe('rgiDeleteQuestionDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $route, $timeout, ngDialog,
        rgiAnswerMethodSrvc, rgiNotifier, rgiFileUploaderSrvc, rgiRequestSubmitterSrvc, rgiUrlCheckSrvc,
        fileUploaderGetStub, fileUploaderGetSpy, ANSWER = 'ANSWER', now;

    beforeEach(inject(
        function (
            $rootScope,
            $controller,
            _$route_,
            _$timeout_,
            _ngDialog_,
            _rgiAnswerMethodSrvc_,
            _rgiNotifier_,
            _rgiFileUploaderSrvc_,
            _rgiRequestSubmitterSrvc_,
            _rgiUrlCheckSrvc_
        ) {
            $timeout = _$timeout_;
            $route = _$route_;
            ngDialog = _ngDialog_;
            rgiAnswerMethodSrvc = _rgiAnswerMethodSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiFileUploaderSrvc = _rgiFileUploaderSrvc_;
            rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;
            rgiUrlCheckSrvc = _rgiUrlCheckSrvc_;

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
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('close');

            $scope.closeDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

        it('clears reference selection', function () {
            $scope.closeDialog();
            $scope.$parent.ref_selection.should.be.equal('');
        });
    });

    describe('#webRefSubmit', function () {
        describe('EMPTY MANDATORY FIELD', function() {
            var notifierMock;

            beforeEach(function() {
                notifierMock = sinon.mock(rgiNotifier);
                notifierMock.expects('error').withArgs('You must enter a title and a url!');
            });

            it('shows an error message, if URL is not set', function () {
                $scope.answer_update = {web_ref_url: '', web_ref_title: 'not empty'};
                $scope.webRefSubmit();
            });

            it('shows an error message, if title is not set', function () {
                $scope.answer_update = {web_ref_url: 'not empty', web_ref_title: ''};
                $scope.webRefSubmit();
            });

            afterEach(function() {
                notifierMock.verify();
                notifierMock.restore();
            });
        });

        describe('REQUEST SENT', function() {
            var urlCheckIsRealStub, urlCheckIsRealSpy, notifierMock, updatedAnswer = {}, TITLE = 'title', currentUser;

            beforeEach(function() {
                notifierMock = sinon.mock(rgiNotifier);
            });

            var initializeCheckUrlStub = function(callback) {
                urlCheckIsRealSpy = sinon.spy(callback);
                urlCheckIsRealStub = sinon.stub(rgiUrlCheckSrvc, 'isReal', urlCheckIsRealSpy);
            };

            var setAnswerData = function(answer) {
                updatedAnswer = answer;
                $scope.answer_update = answer;
                $scope.answer_update.references = {web: []};
                $scope.answer_update.web_ref_title = TITLE;
            };

            var setCurrentUser = function(user) {
                currentUser = user;
                $scope.$parent.current_user = currentUser;
            };

            it('shows an error message on failure', function() {
                initializeCheckUrlStub(function() {
                    return {
                        then: function(callbackSuccess, callbackFailure) {
                            callbackFailure();
                        }
                    };
                });

                notifierMock.expects('error').withArgs('Website does not exists');
                setCurrentUser({});
                setAnswerData({web_ref_url: 'http://google.com'});
                $scope.webRefSubmit();
            });

            describe('URL exists', function() {
                var answerMethodUpdateStub, answerMethodUpdateSpy,
                    initializeUpdateAnswerStub = function(callback) {
                        answerMethodUpdateSpy = sinon.spy(callback);
                        answerMethodUpdateStub = sinon.stub(rgiAnswerMethodSrvc, 'updateAnswer', answerMethodUpdateSpy);
                    };

                beforeEach(function() {
                    initializeCheckUrlStub(function() {
                        return {
                            then: function(callbackSuccess) {
                                callbackSuccess();
                            }
                        };
                    });

                    setCurrentUser({
                        _id: 'ID',
                        firstName: 'First Name',
                        lastName: 'Last Name',
                        role: 'ROLE'
                    });
                });

                describe('SUCCESSFUL UPDATE', function() {
                    var closeThisDialogBackUp, $routeMock;

                    beforeEach(function() {
                        initializeUpdateAnswerStub(function() {
                            return {
                                then: function(callbackSuccess) {
                                    callbackSuccess();
                                }
                            };
                        });

                        $routeMock = sinon.mock($route);
                        $routeMock.expects('reload');
                        notifierMock.expects('notify').withArgs('Reference added!');

                        closeThisDialogBackUp = $scope.closeThisDialog;
                        $scope.closeThisDialog = sinon.spy();
                    });

                    describe('CHECK URL CORRECTNESS', function() {
                        it('keeps the URL unchanged, if the URL begins with HTTP', function() {
                            setAnswerData({web_ref_url: 'http://google.com'});
                        });

                        it('keeps the URL unchanged, if the URL begins with HTTPS', function() {
                            setAnswerData({web_ref_url: 'https://google.com'});
                        });

                        it('sets HTTP protocol by default', function() {
                            setAnswerData({web_ref_url: 'google.com'});
                            updatedAnswer.web_ref_url = 'http://google.com';
                        });

                        afterEach(function() {
                            $scope.webRefSubmit();
                        });
                    });

                    describe('CHECK SAVED URL', function() {
                        var setCheckedUrls = function(rawUrl, expectedUrl) {
                            setAnswerData({web_ref_url: rawUrl});
                            updatedAnswer.web_ref_url = expectedUrl;
                        };

                        it('saves the URL unchanged, if the URL begins with HTTP', function() {
                            setCheckedUrls('http://google.com', 'http://google.com');
                        });

                        it('saves the URL unchanged, if the URL begins with HTTPS', function() {
                            setCheckedUrls('https://google.com', 'https://google.com');
                        });

                        it('saves the URL with HTTP protocol by default', function() {
                            setCheckedUrls('google.com', 'http://google.com');
                        });

                        afterEach(function() {
                            $scope.webRefSubmit();
                            answerMethodUpdateSpy.args[0][0].references.web[0].URL.should.be.equal(updatedAnswer.web_ref_url);
                        });
                    });

                    it('saves access date, if the date is defined', function() {
                        var date = new Date();
                        setAnswerData({web_ref_url: 'http://google.com', web_ref_access_date: date});
                        $scope.webRefSubmit();
                        answerMethodUpdateSpy.args[0][0].references.web[0].access_date.should.be.equal(date.toISOString());
                    });

                    it('saves default access date, if the access date is not defined', function() {
                        $scope.date_default = new Date();
                        setAnswerData({web_ref_url: 'http://google.com'});
                        $scope.webRefSubmit();
                        answerMethodUpdateSpy.args[0][0].references.web[0].access_date.should.be.equal($scope.date_default.toISOString());
                    });

                    it('saves the answer title', function() {
                        setAnswerData({web_ref_url: 'https://google.com'});
                        $scope.webRefSubmit();
                        answerMethodUpdateSpy.args[0][0].references.web[0].title.should.be.equal(TITLE);
                    });

                    it('saves the author attributes', function() {
                        setAnswerData({web_ref_url: 'https://google.com'});
                        $scope.webRefSubmit();
                        answerMethodUpdateSpy.args[0][0].references.web[0].comment.author.should.be.equal(currentUser._id);
                        answerMethodUpdateSpy.args[0][0].references.web[0].comment.role.should.be.equal(currentUser.role);
                        answerMethodUpdateSpy.args[0][0].references.web[0].comment.author_name.should.be
                            .equal(currentUser.firstName + ' ' + currentUser.lastName);
                    });

                    it('saves the comment content, if the comment is defined', function() {
                        var COMMENT = 'COMMENT';
                        setAnswerData({web_ref_url: 'https://google.com', web_ref_comment: COMMENT});
                        $scope.webRefSubmit();
                        answerMethodUpdateSpy.args[0][0].references.web[0].comment.content.should.be.equal(COMMENT);
                    });

                    it('leaves the comment content unset, if the comment is not defined', function() {
                        setAnswerData({web_ref_url: 'https://google.com'});
                        $scope.webRefSubmit();
                        should.not.exist(answerMethodUpdateSpy.args[0][0].references.web[0].comment.content);
                    });

                    it('saves the comment date & time', function() {
                        setAnswerData({web_ref_url: 'https://google.com'});
                        $scope.webRefSubmit();
                        var actualTimestamp = Date.parse(answerMethodUpdateSpy.args[0][0].references.web[0].comment.date);
                        compareDates(new Date(), new Date(actualTimestamp)).should.be.equal(true);
                    });

                    afterEach(function() {
                        $routeMock.verify();
                        $routeMock.restore();

                        $scope.closeThisDialog.called.should.be.equal(true);
                        $scope.closeThisDialog = closeThisDialogBackUp;
                    });
                });

                it('shows an error message on update failure', function() {
                    var UPDATE_FAILURE_REASON = 'UPDATE FAILURE REASON';

                    initializeUpdateAnswerStub(function() {
                        return {
                            then: function(callbackSuccess, callbackFailure) {
                                callbackFailure(UPDATE_FAILURE_REASON);
                            }
                        };
                    });

                    notifierMock.expects('error').withArgs(UPDATE_FAILURE_REASON);
                    setAnswerData({web_ref_url: 'http://google.com'});

                    $scope.webRefSubmit();
                });

                afterEach(function() {
                    notifierMock.verify();
                    notifierMock.restore();
                    answerMethodUpdateStub.restore();
                });
            });

            afterEach(function() {
                urlCheckIsRealSpy.withArgs(updatedAnswer.web_ref_url).called.should.be.equal(true);
                notifierMock.verify();
                notifierMock.restore();
                urlCheckIsRealStub.restore();
            });
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
                            },
                            status: 200
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
                    var uploaderMock, uploadCompletionResponse = generateResponse(1);

                    beforeEach(function() {
                        uploaderMock = sinon.mock($scope.uploader);
                        uploaderMock.expects('onCompleteItem').withArgs({}, uploadCompletionResponse.data, uploadCompletionResponse.status);
                        uploadFile(uploadCompletionResponse);
                    });

                    it('gets the document data by its upload status', function () {
                        requestSubmitterGetSpy.withArgs('/api/remote-file/document/' + ID).called.should.be.equal(true);
                    });

                    it('unsets file uploading flag', function () {
                        $scope.fileUploading.should.be.equal(false);
                    });

                    it('submits the document to the document processing dialog', function () {
                        uploaderMock.verify();
                    });

                    afterEach(function() {
                        uploaderMock.restore();
                    });
                });
            });

            afterEach(function() {
                requestSubmitterGetStub.restore();
            });
        });

    });

    describe('#humanRefSubmit', function() {
        it('does something', function() {

        });
    });

    afterEach(function() {
        fileUploaderGetStub.restore();
    });
});

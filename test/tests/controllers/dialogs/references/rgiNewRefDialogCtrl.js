/*jslint node: true */
'use strict';

describe('rgiNewRefDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, $rootScope, $timeout, rgiAllowedFileExtensionGuideSrvc, ngDialog, rgiDialogFactory, rgiDocumentSrvc,
        rgiFileUploaderSrvc, rgiIdentitySrvc, rgiIntervieweeSrvc, rgiNotifier, rgiRequestSubmitterSrvc,
        stubs = {}, spies = {}, ANSWER = 'ANSWER', FILE_URL = 'http://domain.com/file.png',
        currentUserBackup, currentUser = {role: 'user-role', _id: 'user-id'};

    beforeEach(inject(
        function (
            $controller,
            _$rootScope_,
            _$timeout_,
            _ngDialog_,
            _rgiAllowedFileExtensionGuideSrvc_,
            _rgiDialogFactory_,
            _rgiDocumentSrvc_,
            _rgiFileUploaderSrvc_,
            _rgiIdentitySrvc_,
            _rgiIntervieweeSrvc_,
            _rgiNotifier_,
            _rgiRequestSubmitterSrvc_
        ) {
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            ngDialog = _ngDialog_;
            rgiAllowedFileExtensionGuideSrvc = _rgiAllowedFileExtensionGuideSrvc_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiDocumentSrvc = _rgiDocumentSrvc_;
            rgiFileUploaderSrvc = _rgiFileUploaderSrvc_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;
            rgiIntervieweeSrvc = _rgiIntervieweeSrvc_;
            rgiNotifier = _rgiNotifier_;
            rgiRequestSubmitterSrvc = _rgiRequestSubmitterSrvc_;

            $scope = $rootScope.$new();
            $scope.$parent.answer = ANSWER;

            stubs.AllowedFileExtensionGuideGetList = sinon.stub(rgiAllowedFileExtensionGuideSrvc, 'getList', function() {
                return ['png'];
            });

            spies.documentSrvcQuery = sinon.spy(function(criteria, callback) {
                callback([]);
            });
            stubs.documentSrvcQuery = sinon.stub(rgiDocumentSrvc, 'query', spies.documentSrvcQuery);

            spies.fileUploaderGet = sinon.spy(function() {
                return {queue: [], filters: []};
            });
            stubs.fileUploaderGet = sinon.stub(rgiFileUploaderSrvc, 'get', spies.fileUploaderGet);

            spies.intervieweeQuery = sinon.spy();
            stubs.intervieweeQuery = sinon.stub(rgiIntervieweeSrvc, 'query', spies.intervieweeQuery);

            currentUserBackup = _.cloneDeep(rgiIdentitySrvc.currentUser);
            rgiIdentitySrvc.currentUser = currentUser;

            $scope.closeThisDialog = sinon.spy();
            $controller('rgiNewRefDialogCtrl', {$scope: $scope});
        }
    ));

    it('loads user documents', function () {
        spies.documentSrvcQuery.withArgs({users: currentUser._id}).called.should.be.equal(true);
    });

    it('resets file upload status', function () {
        $scope.fileUploading.should.be.equal(false);
    });

    it('copies answer from the parent scope', function () {
        $scope.answer_update.should.be.equal(ANSWER);
    });

    it('loads interviewees data', function () {
        spies.intervieweeQuery.called.should.be.equal(true);
    });

    it('initializes file uploader', function() {
        spies.fileUploaderGet.withArgs({isHTML5: true, withCredentials: true, url: 'file-upload'}).called.should.be.equal(true);
    });

    it('sets selected document', function() {
        $scope.selected_doc.should.be.equal('none');
    });

    it('initializes the role options', function() {
        $scope.role_opts.should.deep.equal([
            {text: 'Government', value: 'government'},
            {text: 'CSO', value: 'cso'},
            {text: 'Industry', value: 'industry'},
            {text: 'Expert', value: 'expert'},
            {text: 'Other', value: 'other'}]);
    });

    it('initializes the salutation options', function() {
        $scope.salutation_opts.should.deep.equal(['mr.', 'mrs.', 'ms.']);
    });

    it('adds `single file` uploader filter', function() {
        var filter = $scope.uploader.filters[$scope.uploader.filters.length - 2];

        var emptyQueue = {queue: [], fn: filter.fn};
        emptyQueue.fn().should.be.equal(true);

        var nonEmptyQueue = {queue: [1], fn: filter.fn};
        nonEmptyQueue.fn().should.be.equal(false);

        filter.name.should.be.equal('singleFile');
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
            var dialogFactoryMock;

            beforeEach(function() {
                dialogFactoryMock = sinon.mock(rgiDialogFactory);
            });

            it('opens a new document dialog', function () {
                $scope.$parent = {ref_selection: 'document'};
                dialogFactoryMock.expects('documentCreate').withArgs($scope.$parent);
            });

            it('opens a new webpage dialog', function () {
                $scope.$parent = {ref_selection: 'webpage'};
                dialogFactoryMock.expects('webpageCreate').withArgs($scope.$parent);
            });

            afterEach(function() {
                $scope.uploader.onCompleteItem(null, RESPONSE, 200);
                $scope.$parent.new_document.should.be.equal($scope.new_document);
                dialogFactoryMock.verify();
                dialogFactoryMock.restore();
            });
        });

    });

    describe('#selectIntervieweeType', function () {
        it('sets the interviewee type', function () {
            var INTERVIEWEE_TYPE = 'INTERVIEWEE TYPE';
            $scope.selectIntervieweeType(INTERVIEWEE_TYPE);
            $scope.intervieweeType.should.be.equal(INTERVIEWEE_TYPE);
        });
    });

    describe('#closeDialog', function () {
        it('closes the dialog', function () {
            $scope.closeDialog();
            $scope.closeThisDialog.called.should.be.equal(true);
        });

        it('sends a broadcast message', function () {
            var $rootScopeMock = sinon.mock($rootScope);
            $rootScopeMock.expects('$broadcast').withArgs('RESET_SELECTED_REFERENCE_ACTION');

            $scope.closeDialog();

            $rootScopeMock.verify();
            $rootScopeMock.restore();
        });
    });

    describe('#uploadFileByUrl', function () {

        it('sets file uploading flag while the file is uploading', function () {
            $scope.uploadFileByUrl(FILE_URL);
            $scope.fileUploading.should.be.equal(true);
        });

        describe('REQUEST PROCESSING', function() {
            var requestSubmitterGetStub, requestSubmitterGetSpy;

            var uploadFile = function(fileUrl, response) {
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
                $scope.uploadFileByUrl(fileUrl);
            };

            it('submits file URL to the server', function () {
                uploadFile(FILE_URL);
                requestSubmitterGetSpy.withArgs('/api/remote-file-upload?url=' + encodeURIComponent(FILE_URL))
                    .called.should.be.equal(true);
            });

            describe('FAILURE CASE', function() {
                var REASON = 'REASON', notifierErrorStub, notifierErrorSpy;

                beforeEach(function() {
                    notifierErrorSpy = sinon.spy();
                    notifierErrorStub = sinon.stub(rgiNotifier, 'error', notifierErrorSpy);
                    uploadFile(FILE_URL, {data: {reason: REASON}});
                });

                it('unsets file uploading flag', function () {
                    $scope.fileUploading.should.be.equal(false);
                });

                it('shows an error message', function () {
                    notifierErrorSpy.withArgs(REASON).called.should.be.equal(true);
                });

                afterEach(function() {
                    notifierErrorStub.restore();
                });
            });

            describe('SUCCESS CASE', function() {
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

                it('adds an item to the file queue', function () {
                    uploadFile(FILE_URL, generateResponse(0.5));
                    _.isEqual($scope.uploader.queue[$scope.uploader.queue.length - 1], {
                        file: {
                            name: 'file.png',
                            size: SIZE
                        },
                        isUploading: true,
                        progress: 50
                    }).should.be.equal(true);
                });

                describe('INCOMPLETE CASE', function() {
                    it('polls the server for uploading progress', function() {
                        uploadFile(FILE_URL, generateResponse(0.5));
                        $timeout.flush();
                        requestSubmitterGetSpy.withArgs('/api/remote-file/upload-progress/' + ID).called.should.be.equal(true);
                    });
                });

                describe('COMPLETE CASE', function() {
                    var uploaderMock, uploadCompletionResponse = generateResponse(1);

                    beforeEach(function() {
                        uploaderMock = sinon.mock($scope.uploader);
                        uploaderMock.expects('onCompleteItem').withArgs({}, uploadCompletionResponse.data, uploadCompletionResponse.status);
                        uploadFile(FILE_URL, uploadCompletionResponse);
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

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubIndex) {
            stubs[stubIndex].restore();
        });

        rgiIdentitySrvc.currentUser = currentUserBackup;
    });
});

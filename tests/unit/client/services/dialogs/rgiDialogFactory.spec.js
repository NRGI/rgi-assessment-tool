'use strict';

describe('rgiDialogFactory', function () {
    var ngDialog, rgiDialogFactory, rgiNotifier, spies = {}, stubs = {};

    beforeEach(module('app'));

    beforeEach(inject(function(_rgiDialogFactory_, _ngDialog_, _rgiNotifier_) {
        rgiDialogFactory = _rgiDialogFactory_;
        ngDialog = _ngDialog_;
        rgiNotifier = _rgiNotifier_;

        spies.closeDialog = sinon.spy();
        stubs.closeDialog = sinon.stub(ngDialog, 'close', spies.closeDialog);
    }));

    describe('REGULAR DIALOG', function() {
        beforeEach(function() {
            spies.openDialog = sinon.spy();
            stubs.openDialog = sinon.stub(ngDialog, 'open', spies.openDialog);
        });

        describe('WITH ERROR NOTIFICATION', function() {
            var mocks = {};

            beforeEach(function() {
                mocks.notifier = sinon.mock(rgiNotifier);
            });

            describe('#assessmentMove', function () {
                var PARENT = 'PARENT', ACTION = 'ACTION';

                it('opens a dialog if the data are valid', function() {
                    rgiDialogFactory.assessmentMove({assessment_counters: {
                        length: 3,
                        approved: 1,
                        flagged: 1,
                        unresolved: 1
                    }});

                    spies.openDialog.withArgs({
                        template: 'partials/dialogs/assessments/move-assessment-dialog',
                        controller: 'rgiMoveAssessmentDialogCtrl',
                        className: 'ngdialog-theme-default',
                        closeByNavigation: true,
                        scope: {
                            value: true,
                            assessment_counters: {
                                length: 3,
                                approved: 1,
                                flagged: 1,
                                unresolved: 1
                            }
                        }
                    }).called.should.be.equal(true);
                });

                describe('INVALID DATA', function() {
                    beforeEach(function() {
                        mocks.notifier = sinon.mock(rgiNotifier);
                        mocks.notifier.expects('error').withArgs('You must approve or flag all questions!');
                    });

                    it('shows an error message if there are not finalized answers', function() {
                        rgiDialogFactory.assessmentMove({assessment_counters: {
                            length: 2,
                            finalized: 1
                        }});
                    });

                    it('shows an error message if there are not approved or not flagged answers', function() {
                        rgiDialogFactory.assessmentMove({assessment_counters: {
                            length: 4,
                            approved: 1,
                            flagged: 1,
                            unresolved: 1
                        }});
                    });

                    afterEach(function() {
                        mocks.notifier.verify();
                    });
                });
            });

            describe('#assessmentMoveConfirm', function () {
                var PARENT = 'PARENT', ACTION = 'ACTION';

                describe('VALID', function() {
                    beforeEach(function() {
                        rgiDialogFactory.assessmentMoveConfirm({$parent: {name: PARENT}, action: ACTION});
                    });

                    it('opens a dialog', function() {
                        spies.openDialog.withArgs({
                            template: 'partials/dialogs/assessments/move-assessment-confirmation-dialog',
                            controller: 'rgiMoveAssessmentConfirmationDialogCtrl',
                            className: 'ngdialog-theme-default',
                            closeByNavigation: true,
                            scope: {name: PARENT, action: ACTION}
                        }).called.should.be.equal(true);
                    });

                    it('closes other dialogs', function() {
                        spies.closeDialog.withArgs('ngdialog1').called.should.be.equal(true);
                    });
                });

                it('shows an error message if no action is set', function() {
                    mocks.notifier.expects('error').withArgs('You must select an action!');
                    rgiDialogFactory.assessmentMoveConfirm({$parent: {name: PARENT}});
                });
            });

            describe('#assessmentTrialSubmit', function () {
                it('opens a dialog if all questions are marked as `completed`', function() {
                    rgiDialogFactory.assessmentTrialSubmit({assessment_counters: {length: 1, complete: 1}});

                    spies.openDialog.withArgs({
                        template: 'partials/dialogs/assessments/submit-confirmation-dialog',
                        controller: 'rgiSubmitAssessmentConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        closeByNavigation: true,
                        scope: {assessment_counters: {length: 1, complete: 1}, value: true}
                    }).called.should.be.equal(true);
                });

                it('shows an error message if not every question is marked as `completed`', function() {
                    mocks.notifier.expects('error').withArgs('You must complete all assessment trial questions');
                    rgiDialogFactory.assessmentTrialSubmit({assessment_counters: {length: 2, complete: 1}});
                });
            });

            describe('#assessmentSubmit', function () {
                it('opens a dialog if all questions are marked as `completed`', function() {
                    rgiDialogFactory.assessmentSubmit({assessment_counters: {length: 1, complete: 1}});

                    spies.openDialog.withArgs({
                        template: 'partials/dialogs/assessments/submit-confirmation-dialog',
                        controller: 'rgiSubmitAssessmentConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        closeByNavigation: true,
                        scope: {assessment_counters: {length: 1, complete: 1}, value: true}
                    }).called.should.be.equal(true);
                });

                it('shows an error message if not every question is marked as `completed`', function() {
                    mocks.notifier.expects('error').withArgs('You must complete all assessment questions');
                    rgiDialogFactory.assessmentSubmit({assessment_counters: {length: 2, complete: 1}});
                });
            });

            describe('#assessmentResubmit', function () {
                it('opens a dialog if there are no flagged questions', function() {
                    rgiDialogFactory.assessmentResubmit({assessment_counters: {flagged: 0}});

                    spies.openDialog.withArgs({
                        template: 'partials/dialogs/assessments/resubmit-confirmation-dialog',
                        controller: 'rgiResubmitAssessmentConfirmationDialogCtrl',
                        className: 'ngdialog-theme-default',
                        closeByNavigation: true,
                        scope: {assessment_counters: {flagged: 0}, value: true}
                    }).called.should.be.equal(true);
                });

                it('shows an error message if is at least one flagged question', function() {
                    mocks.notifier.expects('error').withArgs('You must resubmit all flagged answers!');
                    rgiDialogFactory.assessmentResubmit({assessment_counters: {flagged: 1}});
                });
            });

            afterEach(function() {
                Object.keys(mocks).forEach(function(mockName) {
                    mocks[mockName].verify();
                    mocks[mockName].restore();
                });
            });
        });

        describe('#assessmentAssign', function () {
            it('opens a dialog', function() {
                var ASSESSMENT_ID = 'ASSESSMENT ID';
                rgiDialogFactory.assessmentAssign({}, {assessment_ID: ASSESSMENT_ID});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/assign-assessment-dialog',
                    controller: 'rgiAssignAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true, assessment_update_ID: ASSESSMENT_ID}
                }).called.should.be.equal(true);
            });
        });

        describe('#assessmentExternalAssign', function () {
            it('opens a dialog', function() {
                var ASSESSMENT_ID = 'ASSESSMENT ID';
                rgiDialogFactory.assessmentExternalAssign({}, {assessment_ID: ASSESSMENT_ID});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/assign-assessment-external-dialog',
                    controller: 'rgiAssignAssessmentMultipleAssigneeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true, assessment_update_ID: ASSESSMENT_ID, userType: 'ext_reviewer'}
                }).called.should.be.equal(true);
            });
        });

        describe('#assessmentSupervisorAssign', function () {
            it('opens a dialog', function() {
                var ASSESSMENT_ID = 'ASSESSMENT ID';
                rgiDialogFactory.assessmentSupervisorAssign({}, {assessment_ID: ASSESSMENT_ID});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/assign-assessment-supervisor-dialog',
                    controller: 'rgiAssignAssessmentMultipleAssigneeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true, assessment_update_ID: ASSESSMENT_ID, userType: 'supervisor'}
                }).called.should.be.equal(true);
            });
        });

        describe('#assessmentAddReviewer', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.assessmentAddReviewer({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/assign-external-to-assessment-dialog',
                    controller: 'rgiAssignExternalToAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#guidanceDialog', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.guidanceDialog({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/answers/guidance-dialog',
                    controller: 'rgiGuidanceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {}
                }).called.should.be.equal(true);
            });
        });

        describe('#assessmentNew', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.assessmentNew({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/new-assessment-dialog',
                    controller: 'rgiNewAssessmentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#answerFinalChoice', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.answerFinalChoice({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#answerExternalChoice', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.answerExternalChoice({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/answers/final-choice-dialog',
                    controller: 'rgiFinalChoiceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#commentEdit', function () {
            it('opens a dialog', function() {
                var ANSWER = 'ANSWER', COMMENT = 'COMMENT';
                rgiDialogFactory.commentEdit(ANSWER, COMMENT);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/comments/edit-comment-dialog',
                    controller: 'rgiEditCommentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    data: {answer: ANSWER, comment: COMMENT}
                }).called.should.be.equal(true);
            });
        });

        describe('#deleteComment', function () {
            it('opens a dialog', function() {
                var COMMENT = 'COMMENT';
                rgiDialogFactory.deleteComment({}, COMMENT);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/comments/delete-comment-dialog',
                    controller: 'rgiDeleteCommentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {comment: COMMENT}
                }).called.should.be.equal(true);
            });
        });

        describe('#deleteDocument', function () {
            it('opens a dialog', function() {
                var DOCUMENT = 'DOCUMENT';
                rgiDialogFactory.deleteDocument({}, DOCUMENT);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/documents/delete-document-dialog',
                    controller: 'rgiDeleteDocumentDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {document: DOCUMENT}
                }).called.should.be.equal(true);
            });
        });

        describe('#deleteInterviewee', function () {
            it('opens a dialog', function() {
                var INTERVIEWEE = 'INTERVIEWEE', redirectToIntervieweeList = 'redirect';
                rgiDialogFactory.deleteInterviewee({}, INTERVIEWEE, redirectToIntervieweeList);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/interviewees/delete-interviewee-dialog',
                    controller: 'rgiDeleteIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {interviewee: INTERVIEWEE, redirectToIntervieweeList: redirectToIntervieweeList}
                }).called.should.be.equal(true);
            });
        });

        describe('#documentEdit', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.documentEdit({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/references/edit-document-dialog',
                    controller: 'rgiEditDocumentDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#createResource', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.createResource({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/resources/new-resource-dialog',
                    controller: 'rgiNewResourceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {}
                }).called.should.be.equal(true);
            });
        });

        describe('#deleteResource', function () {
            it('opens a dialog', function() {
                var RESOURCE = 'RESOURCE';
                rgiDialogFactory.deleteResource({}, RESOURCE);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/resources/delete-resource-confirmation-dialog',
                    controller: 'rgiDeleteResourceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {resource: RESOURCE}
                }).called.should.be.equal(true);
            });
        });

        describe('#flagCreate', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.flagCreate({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/flags/flag-answer-dialog',
                    controller: 'rgiFlagAnswerDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    overlay: false,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#flagEdit', function () {
            it('opens a dialog', function() {
                var FLAG = 'FLAG', INDEX = 'INDEX';
                rgiDialogFactory.flagEdit({}, FLAG, INDEX);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/flags/flag-answer-dialog',
                    controller: 'rgiFlagEditDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true, flag: FLAG, index: INDEX}
                }).called.should.be.equal(true);
            });
        });

        describe('#intervieweeEdit', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.intervieweeEdit({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/references/edit-interviewee-dialog',
                    controller: 'rgiEditIntervieweeDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#questionNew', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.questionNew({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/questions/new-question-dialog',
                    controller: 'rgiNewQuestionDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#questionDelete', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.questionDelete({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/questions/delete-question-confirmation-dialog',
                    controller: 'rgiDeleteQuestionDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#setAssessmentStatus', function () {
            it('opens a dialog', function() {
                var ASSESSMENT_ID = 'ASSESSMENT ID', STATUS = 'STATUS';
                rgiDialogFactory.setAssessmentStatus({}, ASSESSMENT_ID, STATUS);

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/assessments/assessment-status-dialog',
                    controller: 'rgiAssessmentStatusDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {assessmentId: ASSESSMENT_ID, newStatus: STATUS}
                }).called.should.be.equal(true);
            });
        });

        describe('#userEdit', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.userEdit({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/users/edit-user-dialog',
                    controller: 'rgiEditUserDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#userDelete', function () {
            it('opens a dialog', function() {
                rgiDialogFactory.userDelete({});

                spies.openDialog.withArgs({
                    template: 'partials/dialogs/users/delete-user-confirmation-dialog',
                    controller: 'rgiDeleteUserDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });
    });

    describe('CONFIRMATION DIALOG', function() {
        beforeEach(function() {
            spies.openConfirm = sinon.spy();
            stubs.openConfirm = sinon.stub(ngDialog, 'openConfirm', spies.openConfirm);
        });

        describe('#referenceSelect', function () {
            it('opens a dialog', function() {
                var REFERENCE = 'REFERENCE';
                rgiDialogFactory.referenceSelect({}, REFERENCE);

                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/new-ref-dialog',
                    controller: 'rgiNewRefDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {ref_selection: REFERENCE, value: true}
                }).called.should.be.equal(true);
            });
        });

        describe('#editDocumentReference', function () {
            it('opens a dialog', function() {
                var REFERENCE = 'REFERENCE';
                rgiDialogFactory.editDocumentReference({}, REFERENCE);

                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/edit-document-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {ref_index: REFERENCE}
                }).called.should.be.equal(true);
            });
        });

        describe('#editInterviewReference', function () {
            it('opens a dialog', function() {
                var REFERENCE = 'REFERENCE';
                rgiDialogFactory.editInterviewReference({}, REFERENCE);

                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/edit-interview-reference-dialog',
                    controller: 'rgiEditReferenceDialogCtrl',
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {ref_index: REFERENCE}
                }).called.should.be.equal(true);
            });
        });

        describe('#referenceDeleteConfirmation', function () {
            it('opens a dialog', function() {
                var REFERENCE = 'REFERENCE';
                rgiDialogFactory.referenceDeleteConfirmation({}, REFERENCE);

                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/delete-reference-dialog',
                    controller: 'rgiDeleteReferenceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {ref_index: REFERENCE}
                }).called.should.be.equal(true);
            });
        });

        describe('#restoreReference', function () {
            it('opens a dialog', function() {
                var REFERENCE = 'REFERENCE';
                rgiDialogFactory.restoreReference({}, REFERENCE);

                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/restore-reference-dialog',
                    controller: 'rgiDeleteReferenceDialogCtrl',
                    className: 'ngdialog-theme-default',
                    closeByNavigation: true,
                    scope: {ref_index: REFERENCE}
                }).called.should.be.equal(true);
            });
        });

        describe('#documentCreate', function () {
            var FILE_URL = 'file url';

            beforeEach(function() {
                rgiDialogFactory.documentCreate({}, FILE_URL);
            });

            it('closes open dialogs', function() {
                spies.closeDialog.withArgs('ngdialog1').called.should.be.equal(true);
            });

            it('opens a dialog', function() {
                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/new-document-dialog',
                    controller: 'rgiNewDocumentDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true, source: FILE_URL}
                }).called.should.be.equal(true);
            });
        });

        describe('#webpageCreate', function () {
            beforeEach(function() {
                rgiDialogFactory.webpageCreate({});
            });

            it('closes open dialogs', function() {
                spies.closeDialog.withArgs('ngdialog1').called.should.be.equal(true);
            });

            it('opens a dialog', function() {
                spies.openConfirm.withArgs({
                    template: 'partials/dialogs/references/new-webpage-dialog',
                    controller: 'rgiNewWebpageDialogCtrl',
                    showClose:false,
                    className: 'ngdialog-theme-default dialogwidth800',
                    closeByNavigation: true,
                    scope: {value: true}
                }).called.should.be.equal(true);
            });
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});

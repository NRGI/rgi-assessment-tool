'use strict';

describe('rgiContactTechCtrl', function () {
    beforeEach(module('app'));

    var $scope, $location,
        rgiAssessmentSrvc, rgiContactMethodSrvc, rgiHttpResponseProcessorSrvc, rgiIdentitySrvc, rgiNotifier,
        backups = {}, callbacks = {}, spies = {}, stubs = {}, values = {},
        initializeController = function(currentUser) {
            beforeEach(inject(
                function ($rootScope, $controller, _$location_, _rgiAssessmentSrvc_, _rgiHttpResponseProcessorSrvc_,
                          _rgiIdentitySrvc_, _rgiNotifier_, _rgiContactMethodSrvc_) {
                    spies.assessmentQuery = sinon.spy(function(criteria, callback, errorHandler) {
                        callbacks.assessmentQuery = callback;
                        values.httpErrorHandler = errorHandler;
                    });

                    rgiAssessmentSrvc = _rgiAssessmentSrvc_;
                    stubs.assessmentQuery = sinon.stub(rgiAssessmentSrvc, 'query', spies.assessmentQuery);

                    spies.httpResponseProcessorGetDefaultHandler = sinon.spy(function(errorMessage) {
                        return errorMessage;
                    });

                    rgiHttpResponseProcessorSrvc = _rgiHttpResponseProcessorSrvc_;
                    stubs.httpResponseProcessorGetDefaultHandler = sinon.stub(rgiHttpResponseProcessorSrvc,
                        'getDefaultHandler', spies.httpResponseProcessorGetDefaultHandler);

                    rgiIdentitySrvc = _rgiIdentitySrvc_;
                    backups.identityCurrentUser = angular.copy(rgiIdentitySrvc.currentUser);
                    rgiIdentitySrvc.currentUser = currentUser;

                    $location = _$location_;
                    rgiNotifier = _rgiNotifier_;
                    rgiContactMethodSrvc = _rgiContactMethodSrvc_;

                    $scope = $rootScope.$new();
                    $controller('rgiContactTechCtrl', {$scope: $scope});
                }
            ));
        };

    describe('user is not set', function() {
        initializeController();

        it('sets the issue list', function() {
            $scope.issue_selection.should.deep.equal([
                {name: 'Trouble logging in.', value: 'login'},
                {name: 'Parts of the site are down.', value: 'down'},
                {name: 'Visual components don\'t look correct', value: 'visual'},
                {name: 'Answers don\'t seem to be saving when completed', value: 'save'},
                {name: 'Documents cannot be saved', value: 'upload'},
                {name: 'Cannot edit comments/justification fields', value: 'justification'},
                {name: 'Other', value: 'other'}
            ]);
        });

        it('sets the OS list', function() {
            $scope.os_selection.should.deep.equal([
                {name: 'Android', value: 'android'},
                {name: 'Windows Phone', value: 'windows_ph'},
                {name: 'iOS', value: 'ios'},
                {name: 'Windows 10', value:'win10'},
                {name: 'Windows 8.1', value:'win8.1'},
                {name: 'Windows 8', value: 'win8'},
                {name: 'Windows 7', value: 'win7'},
                {name: 'Windows XP', value: 'winxp'},
                {name: 'OS X El Capitan', value: 'osx10.11'},
                {name: 'OS X Yosemite', value: 'osx10.10'},
                {name: 'OS X Mavericks', value: 'osx10.9'},
                {name: 'OS X Mountain Lion', value: 'osx10.8'},
                {name: 'OS X Lion', value: 'osx10.7'},
                {name: 'OS X Snow Leopard', value: 'osx10.6'},
                {name: 'Ubuntu', value: 'ubuntu'},
                {name: 'Other', value: 'other'}
            ]);
        });

        it('sets the issue list', function() {
            $scope.browser_selection.should.deep.equal([
                {name: 'Internet Explorer', value: 'ie'},
                {name: 'Firefox', value: 'firefox'},
                {name: 'Chrome', value: 'chrome'},
                {name: 'Opera', value: 'opera'},
                {name: 'Yandex', value: 'yandex'},
                {name: 'Safari', value: 'safari'},
                {name: 'Other', value: 'other'}
            ]);
        });

        it('selects the issue', function() {
            $scope.request.should.deep.equal({
                tool: 'rgi',
                issue: {name: 'Other', value: 'other'}
            });
        });

        it('does not load the assessment data', function() {
            spies.assessmentQuery.called.should.be.equal(false);
        });
    });

    describe('current user is set', function() {
        var CURRENT_USER = {
            _id: 'CURRENT USER ID',
            email: 'CURRENT@USER.EMAIL',
            firstName: 'CURRENT USER FIRST NAME',
            lastName: 'CURRENT USER LAST NAME',
            role: 'CURRENT USER ROLE'
        };

        initializeController(CURRENT_USER);

        it('automatically supplements the request data', function() {
            $scope.request.first_name.should.be.equal(CURRENT_USER.firstName);
            $scope.request.last_name.should.be.equal(CURRENT_USER.lastName);
            $scope.request.email.should.be.equal(CURRENT_USER.email);
        });

        it('submits a request to get the assessment data', function() {
            var criteria = {};
            criteria[CURRENT_USER.role + '_ID'] = CURRENT_USER._id;
            spies.assessmentQuery.withArgs(criteria).called.should.be.equal(true);
        });

        it('processes HTTP failures', function() {
            values.httpErrorHandler.should.be.equal('Load assessment data failure');
        });

        describe('GET ASSESSMENT DATA CALLBACK', function() {
            it('does nothing if the assessment list is empty', function() {
                callbacks.assessmentQuery([]);
                should.not.exist($scope.assessments);
                should.not.exist($scope.request.assessment);
            });

            it('supplements the request if just one assessment is got', function() {
                var ASSESSMENT = 'assessment';
                callbacks.assessmentQuery([ASSESSMENT]);
                $scope.request.assessment.should.be.equal(ASSESSMENT);
            });

            it('sets sorted assessments list if more than one assessment are got', function() {
                callbacks.assessmentQuery([
                    {"country": "Columbia", "year": 2016, "version": "MI", "mineral": "Gold"},
                    {"country": "Brazil", "year": 2016, "version": "MI", "mineral": "Gold"},
                    {"country": "Brazil", "year": 2017, "version": "MI", "mineral": "Iron"},
                    {"country": "Brazil", "year": 2017, "version": "HY"},
                    {"country": "Brazil", "year": 2017, "version": "MI", "mineral": "Gold"}
                ]);

                $scope.assessments.should.deep.equal([
                    {"country": "Brazil", "year": 2016, "version": "MI", "mineral": "Gold"},
                    {"country": "Brazil", "year": 2017, "version": "HY"},
                    {"country": "Brazil", "year": 2017, "version": "MI", "mineral": "Gold"},
                    {"country": "Brazil", "year": 2017, "version": "MI", "mineral": "Iron"},
                    {"country": "Columbia", "year": 2016, "version": "MI", "mineral": "Gold"}
                ]);
            })
        });
    });

    describe('#sendRequest', function() {
        var mocks = {};

        var sendRequest = function(contactData) {
            $scope.request = contactData;
            $scope.sendRequest();
        };

        beforeEach(function() {
            mocks.notifier = sinon.mock(rgiNotifier);
        });

        it('shows an error message if the first name is not set', function() {
            mocks.notifier.expects('error').withArgs('You must supply a name!');
            sendRequest({});
        });

        it('shows an error message if the last name is not set', function() {
            mocks.notifier.expects('error').withArgs('You must supply a name!');
            sendRequest({first_name: true});
        });

        it('shows an error message if the email is not set', function() {
            mocks.notifier.expects('error').withArgs('You must supply an email!');
            sendRequest({first_name: true, last_name: true});
        });

        it('shows an error message if the issue is not selected', function() {
            mocks.notifier.expects('error').withArgs('You must select an issue!');
            sendRequest({first_name: true, last_name: true, email: true});
        });

        describe('VALID DATA', function() {
            var CONTACT_DATA = {first_name: true, last_name: true, email: true, issue: true};

            beforeEach(function() {
                spies.contactMethodContact = sinon.spy(function() {
                    return {
                        then: function(callbackSuccess, callbackFailure) {
                            callbacks.contactMethodContactSuccess = callbackSuccess;
                            callbacks.contactMethodContactFailure = callbackFailure;
                        }
                    };
                });

                stubs.contactMethodContact = sinon.stub(rgiContactMethodSrvc, 'contact', spies.contactMethodContact);
                sendRequest(CONTACT_DATA);
            });

            it('submits the contact tech supprt request', function() {
                spies.contactMethodContact.withArgs(CONTACT_DATA).called.should.be.equal(true);
            });

            it('shows the failure reason in case of a failure', function() {
                var ERROR = 'error';
                mocks.notifier.expects('error').withArgs(ERROR);
                callbacks.contactMethodContactFailure(ERROR);
            });

            describe('SUCCESS CASE', function() {
                it('shows a success notification', function() {
                    mocks.notifier.expects('notify').withArgs('Request sent.');
                });

                it('redirects to the home page', function() {
                    mocks.$location = sinon.mock($location);
                    mocks.$location.expects('path').withArgs('/');
                });

                afterEach(function() {
                    callbacks.contactMethodContactSuccess();
                });
            });
        });

        afterEach(function() {
            Object.keys(mocks).forEach(function(mockName) {
                mocks[mockName].verify();
                mocks[mockName].restore();
            });
        })
    });

    afterEach(function () {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });

        rgiIdentitySrvc.currentUser = backups.identityCurrentUser;
    });
});

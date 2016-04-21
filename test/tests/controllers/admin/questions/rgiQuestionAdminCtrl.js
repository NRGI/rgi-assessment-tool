'use strict';

describe('rgiQuestionAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog, rgiDialogFactory, rgiQuestionSrvc, rgiPreceptGuideSrvc,
        questionQueryStub, questionQuerySpy, getPreceptsStub, getPreceptsSpy,
        questionsData = [
            {
                question_label: 'QUESTION LABEL',
                question_order: 'QUESTION ORDER',
                question_text: 'QUESTION TEXT',
                question_type: 'QUESTION TYPE',
                component_text: 'COMPONENT TEXT',
                indicator_name: 'INDICATOR NAME',
                precept: 1,
                question_criteria: [
                    {name: 'Yes', text: 'yes'},
                    {name: 'No', text: 'no'}
                ]
            }
        ];

    beforeEach(inject(
        function ($rootScope, $controller, _ngDialog_, _rgiDialogFactory_, _rgiPreceptGuideSrvc_, _rgiQuestionSrvc_) {
            ngDialog = _ngDialog_;
            rgiDialogFactory = _rgiDialogFactory_;
            rgiPreceptGuideSrvc = _rgiPreceptGuideSrvc_;
            rgiQuestionSrvc = _rgiQuestionSrvc_;
            $scope = $rootScope.$new();
            /*jshint unused: true*/
            /*jslint unparam: true*/
            questionQuerySpy = sinon.spy(function (uselessObject, callback) {
                callback(questionsData);
            });
            /*jshint unused: false*/
            /*jslint unparam: false*/
            questionQueryStub = sinon.stub(rgiQuestionSrvc, 'query', questionQuerySpy);

            getPreceptsSpy = sinon.spy(function () {
                return {precept_1: {section_len: 0, data: []}};
            });
            getPreceptsStub = sinon.stub(rgiPreceptGuideSrvc, 'getQuestionTemplates', getPreceptsSpy);

            $controller('rgiQuestionAdminCtrl', {$scope: $scope});
        }
    ));

    it('initializes sorting order', function () {
        $scope.order_reverse.should.be.equal(true);
    });

    it('sets the header', function () {
        $scope.header.should.deep.equal([
            'Question Order',
            'Question Label',
            'NRC Precept',
            'Question Type',
            'Question Text',
            'Component Text',
            'Indicator Name',
            'Dejure'
        ]);
    });

    it('loads the question data', function () {
        $scope.questions.should.deep.equal({precept_1: {section_len: 1, data: [questionsData[0]]}});
    });

    describe('#getExportedQuestions', function () {
        it('returns transformed question data', function () {
            JSON.stringify($scope.getExportedQuestions()).should.be.equal(JSON.stringify([
                {
                    question_order: 'QUESTION ORDER',
                    question_label: 'QUESTION LABEL',
                    precept: 1,
                    question_type: 'QUESTION TYPE',
                    question_text: 'QUESTION TEXT',
                    component_text: 'COMPONENT TEXT',
                    indicator_name: 'INDICATOR NAME',
                    choice_0: 'Yes',
                    choice_0_criteria: 'yes',
                    choice_1: 'No',
                    choice_1_criteria: 'no'
                }
            ]));
        });
    });

    describe('#newQuestionDialog', function () {
        it('opens a dialog', function () {
            var dialogFactoryMock = sinon.mock(rgiDialogFactory);
            dialogFactoryMock.expects('questionNew').withArgs($scope);

            $scope.newQuestionDialog();

            dialogFactoryMock.verify();
            dialogFactoryMock.restore();
        });

    });

    afterEach(function () {
        questionQueryStub.restore();
        getPreceptsStub.restore();
    });
});

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
                dejure: 'DEJURE',
                precept: 1,
                question_criteria: [
                    {name: 'yes', text: 'Yes'},
                    {name: 'no', text: 'No'}
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
            $scope.getExportedQuestions().should.deep.equal([
                {
                    question_order: questionsData[0].question_order,
                    question_label: questionsData[0].question_label,
                    precept: questionsData[0].precept,
                    dejure: questionsData[0].dejure,
                    question_type: questionsData[0].question_type,
                    question_text: questionsData[0].question_text,
                    component_text: questionsData[0].component_text,
                    indicator_name: questionsData[0].indicator_name,
                    choice_0: questionsData[0].question_criteria[0].name,
                    choice_0_criteria: questionsData[0].question_criteria[0].text,
                    choice_1: questionsData[0].question_criteria[1].name,
                    choice_1_criteria: questionsData[0].question_criteria[1].text
                }
            ]);
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

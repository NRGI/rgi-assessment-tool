'use strict';

describe('rgiQuestionAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog, rgiDialogFactory, rgiQuestionSrvc, questionQueryStub, questionQuerySpy,
        questionsData = [
            {
                question_order: 'QUESTION ORDER',
                question_text: 'QUESTION TEXT',
                component_text: 'COMPONENT TEXT',
                indicator_name: 'INDICATOR NAME',
                sub_indicator_name: 'SUBINDICATOR NAME',
                minstry_if_applicable: 'MINISTRY IF APPLICABLE',
                section_name: 'SECTION NAME',
                child_question: 'CHILD QUESTION',
                nrc_precept: 'NRC PRECEPT',
                question_choices: [
                    {name: 'Yes', criteria: 'yes'},
                    {name: 'No', criteria: 'no'}
                ]
            }
        ];

    beforeEach(inject(
        function ($rootScope, $controller, _ngDialog_, _rgiDialogFactory_, _rgiQuestionSrvc_) {
            ngDialog = _ngDialog_;
            rgiDialogFactory = _rgiDialogFactory_;
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

            $controller('rgiQuestionAdminCtrl', {$scope: $scope});
        }
    ));

    it('initializes sorting options', function () {
        $scope.sort_options.should.deep.equal([
            {value: 'question_order', text: 'Sort by Question Order'},
            {value: 'component_text', text: 'Sort by Component'},
            {value: 'question_text', text: 'Sort by Question Text'}
        ]);
    });

    it('initializes sorting order', function () {
        $scope.sort_order.should.be.equal('question_order');
    });

    it('sets the header', function () {
        $scope.header.should.deep.equal([
            'Question Order',
            'Question Text',
            'Component Text',
            'Indicator Name',
            'Subindicator Name',
            'Ministry', 'Section',
            'Child Question',
            'NRC Precept'
        ]);
    });

    it('loads the question data', function () {
        $scope.questions.should.deep.equal(questionsData);
    });

    it('transforms the loaded question data', function () {
        $scope.getArray.should.deep.equal([
            {
                question_order: 'QUESTION ORDER',
                question_text: 'QUESTION TEXT',
                component_text: 'COMPONENT TEXT',
                indicator_name: 'INDICATOR NAME',
                sub_indicator_name: 'SUBINDICATOR NAME',
                minstry_if_applicable: 'MINISTRY IF APPLICABLE',
                section_name: 'SECTION NAME',
                child_question: 'CHILD QUESTION',
                nrc_precept: 'NRC PRECEPT',
                choice_0: 'Yes',
                choice_0_criteria: 'yes',
                choice_1: 'No',
                choice_1_criteria: 'no'
            }
        ]);
    });

    describe('#newQuestionDialog', function () {
        it('opens a dialog', function () {
            var ngDialogMock = sinon.mock(rgiDialogFactory);
            ngDialogMock.expects('questionNew').withArgs($scope);

            $scope.newQuestionDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

    });

    afterEach(function () {
        questionQueryStub.restore();
    });
});

/*jslint node: true */
'use strict';
/*jslint nomen: true newcap: true */
var _, describe, beforeEach, afterEach, it, inject, expect, sinon;

describe('rgiQuestionAdminCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog, rgiQuestionSrvc, questionQueryStub, questionQuerySpy,
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
        function ($rootScope, $controller, _ngDialog_, _rgiQuestionSrvc_) {
            ngDialog = _ngDialog_;
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
        _.isEqual($scope.sort_options, [
            {value: "question_order", text: "Sort by Question Order"},
            {value: "component_text", text: "Sort by Component"},
            {value: "status", text: "Sort by Status"}
        ]).should.be.equal(true);
    });

    it('initializes sorting order', function () {
        $scope.sort_order.should.be.equal('question_order');
    });

    it('sets the header', function () {
        _.isEqual([
            'Question Order',
            'Question Text',
            'Component Text',
            'Indicator Name',
            'Subindicator Name',
            'Ministry', 'Section',
            'Child Question',
            'NRC Precept'
        ], $scope.header).should.be.equal(true);
    });

    it('loads the question data', function () {
        _.isEqual($scope.questions, questionsData).should.be.equal(true);
    });

    it('transforms the loaded question data', function () {
        _.isEqual([
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
        ], $scope.getArray).should.be.equal(true);
    });

    describe('#newQuestionDialog', function () {
        it('sets the value to TRUE', function () {
            $scope.newQuestionDialog();
            $scope.value.should.be.equal(true);
        });

        it('opens a dialog', function () {
            var ngDialogMock = sinon.mock(ngDialog);
            ngDialogMock.expects('open').withArgs({
                template: 'partials/dialogs/new-question-dialog',
                controller: 'rgiNewQuestionDialogCtrl',
                className: 'ngdialog-theme-plain dialogwidth800',
                scope: $scope
            });

            $scope.newQuestionDialog();

            ngDialogMock.verify();
            ngDialogMock.restore();
        });

    });

    afterEach(function () {
        questionQueryStub.restore();
    });
});

'use strict';

describe('rgiNewQuestionDialogCtrl', function () {
    beforeEach(module('app'));

    var $scope, ngDialog, rgiNotifier, rgiIdentitySrvc, identityCurrentUserBackUp, CURRENT_USER = 'CURRENT USER';

    beforeEach(inject(
        function ($rootScope, $controller, _ngDialog_, _rgiNotifier_, _rgiIdentitySrvc_) {
            ngDialog = _ngDialog_;
            rgiNotifier = _rgiNotifier_;
            rgiIdentitySrvc = _rgiIdentitySrvc_;

            identityCurrentUserBackUp = rgiIdentitySrvc.currentUser;
            rgiIdentitySrvc.currentUser = CURRENT_USER;

            $scope = $rootScope.$new();
            $scope.questions = [];

            $controller('rgiNewQuestionDialogCtrl', {$scope: $scope});
        }
    ));

    it('sets current user data', function() {
        $scope.current_user.should.be.equal(CURRENT_USER);
    });

    it('sets the dialog model data', function() {
        $scope.dialogModel.should.deep.equal({message: 'message from passed scope'});
    });

    it('sets new question template data', function() {
        $scope.new_question.should.deep.equal({
            question_order: 1,
            question_text: 'Enter text',
            question_choices: [{order: 1, criteria: 'Enter text'}]
        });
    });

    describe('#closeDialog', function() {
        it('closes the current dialog', function() {
            var dialogMock = sinon.mock(ngDialog);
            dialogMock.expects('close');

            $scope.closeDialog();

            dialogMock.verify();
            dialogMock.restore();
        });
    });

    describe('#questionCreate', function() {
        it('shows an error message', function() {
            var notifierMock = sinon.mock(rgiNotifier);
            notifierMock.expects('error').withArgs('Function coming soon!');

            $scope.questionCreate();

            notifierMock.verify();
            notifierMock.restore();
        });
    });

    describe('#questionOptionAdd', function() {
        it('adds a new option to the option list', function() {
            $scope.new_question.question_choices = [
                {criteria: 'Option # 1', order: 1},
                {criteria: 'Option # 2', order: 2}
            ];

            $scope.questionOptionAdd();

            $scope.new_question.question_choices.should.deep.equal([
                {criteria: 'Option # 1', order: 1},
                {criteria: 'Option # 2', order: 2},
                {criteria: 'Enter text', order: 3}
            ]);
        });
    });

    describe('#questionOptionDelete', function() {
        it('remove an option by its index from the option list', function() {
            $scope.new_question.question_choices = [
                {criteria: 'Option # 1', order: 1},
                {criteria: 'Option # 2', order: 2},
                {criteria: 'Option # 3', order: 3}
            ];

            $scope.questionOptionDelete(1);

            $scope.new_question.question_choices.should.deep.equal([
                {criteria: 'Option # 1', order: 1},
                {criteria: 'Option # 3', order: 2}
            ]);
        });
    });

    afterEach(function() {
        rgiIdentitySrvc.currentUser = identityCurrentUserBackUp;
    });
});

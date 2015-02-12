angular.module('app').controller('rgiQuestionAdminCtrl', function ($scope, rgiQuestionSrvc, ngDialog) {
    $scope.questions = rgiQuestionSrvc.query();

    // filtering options
    $scope.sortOptions = [
        {value: "question_order", text: "Sort by Question Order"},
        {value: "component_text", text: "Sort by Component"},
        {value: "status", text: "Sort by Status"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.newQuestionDialog = function () {
        ngDialog.open({ template: 'new-question-dialog.html' });
    };
});
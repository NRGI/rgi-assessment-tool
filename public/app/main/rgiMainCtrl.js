angular.module('app').controller('rgiMainCtrl', function($scope, rgiQuestion) {
	$scope.questions = rgiQuestion.query();
});
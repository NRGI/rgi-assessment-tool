angular.module('app').controller('rgiQuestionAdminUpdateCtrl', function($scope, $routeParams, rgiNotifier, rgiQuestionMethodSrvc, rgiQuestionSrvc) {

	$scope.question = rgiQuestionSrvc.get({_id:$routeParams.id});

	$scope.componentOptions = [
	    {value:'null',text:'N/A'},
	    {value:'institutional',text:'Institutional and legal setting'},
	    {value:'effectiveness',text:'Government effectiveness'},
	    {value:'reporting',text:'Reporting practices'}
	];

	$scope.questionOptionAdd = function() {
		$scope.question.question_choices.push({order: $scope.question.question_choices.length+1, criteria: "Enter text"});
	};

	$scope.optionDelete = function(index) {
		$scope.question.question_choices.splice(index,1);
		for (var i = $scope.question.question_choices.length - 1; i >= 0; i--) {
			$scope.question.question_choices[i].order = i+1
		};
	};

	$scope.questionUpdate = function() {
		var newQuestionData = $scope.question;
		rgiQuestionMethodSrvc.updateQuestion(newQuestionData).then(function() {
			rgiNotifier.notify('Question data has been updated');
		}, function(reason) {
			rgiNotifier.error(reason);
		});
	};

	$scope.questionDelete = function() {

	};
});
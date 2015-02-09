angular.module('app').controller('rgiAssessmentDashboardDetailCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, $routeParams) {
	rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID}, function(data) {
		data.reviewer = rgiUserListSrvc.get({_id:data.reviewer_ID});
		data.researcher = rgiUserListSrvc.get({_id:data.researcher_ID});
		data.assigned_by = rgiUserListSrvc.get({_id:data.assignment.assigned_by});
		data.edited_by = rgiUserListSrvc.get({_id:data.modified[data.modified.length-1].modified_by});
		data.question_list = rgiAnswerSrvc.query({assessment_ID:data.assessment_ID});

		rgiQuestionSrvc.query(function(question_data) {
			for (var i = 0; i < data.question_list.length; i++) {
				for (var j = 0; j < question_data.length; j++) {
					if(data.question_list[i].question_ID===question_data[j]._id){
						// console.log(data.question_list[i].question_ID);
						data.question_list[i].question_text = question_data[j].question_text;
					};
				};
			};
		});
		$scope.assessment = data;
		

		$scope.sortOptions = 	[	
									{value: "question_order", text: "Sort by Question Number"},
									{value: "component_id", text: "Sort by Component"},
									{value: "status", text: "Sort by Status"}
								];
		$scope.sortOrder = $scope.sortOptions[0].value;

	});
});

angular.module('app').filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
});
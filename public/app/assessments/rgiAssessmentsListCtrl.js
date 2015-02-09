angular.module('app').controller('rgiAssessmentsListCtrl', function($scope, $location, rgiNotifier, rgiAssessmentSrvc, rgiUserListSrvc, rgiIdentitySrvc, rgiUserMethodSrvc, rgiAssessmentMethodSrvc) {

	var currentUser = rgiIdentitySrvc.currentUser;
 	
 	rgiAssessmentSrvc.query({[currentUser.roles[0] + "_ID"]:currentUser._id},function(data) {
		// pull assessment list from collection and adds user name to match reviewer id and researcher id
		$scope.assessments = [];
		for (var i = data.length - 1; i >= 0; i--) {
			var assessment = data[i];
			if(assessment.reviewer_ID != undefined) {
				assessment.reviewer = rgiUserListSrvc.get({_id:assessment.reviewer_ID});
				assessment.researcher = rgiUserListSrvc.get({_id:assessment.researcher_ID});
			};
			
			$scope.assessments.push(assessment);
		};
	});
	
	$scope.sortOptions = [{value:'country',text:'Sort by Country'},
		{value:'start_date', text:'Date started'},
		{value:'status', text:'Status'}]
	$scope.sortOrder = $scope.sortOptions[0].value;



	$scope.assessmentStart = function(assessment) {
		// update assessment status
		// update assessment modified
		// update assessment start date





		console.log(assessment);
		// var today = new Date().;
		// console.log(today);
	// 	var newUserData = currentUser;
	// 	var newAssessmentData = new rgiAssessmentSrvc(assessment);
	// 	delete newAssessmentData.researcher;
	// 	delete newAssessmentData.reviewer;
	// 	newAssessmentData.start_date = today;
	// 	newAssessmentData.last_edit = today;
	// 	newAssessmentData.status = 'started';

	// 	for (var i = 0; i < newUserData.assessments.length; i++) {
	// 		if(newUserData.assessments[i].assessment_id == assessment.assessment_ID) {
	// 			newUserData.assessments[i].started = today;
	// 		}
	// 	};

		


	// 	rgiUserMethodSrvc.updateUser(newUserData)
	// 		.then(rgiAssessmentMethodSrvc.updateAssessment(newAssessmentData))
	// 		.then(function() {
	// 			rgiNotifier.notify('Assessment assigned!');
	// 			$location.path('/assments/assessment/' + newAssessmentData.assessment_ID + '001');
	// 		}, function(reason) {
	// 			rgiNotifier.error(reason);
	// 		});
		
	// 	// rgiAssessmentMethodSrvc.updateAssessment(newAssessmentData).then(function() {
	// 	// 	rgiNotifier.notify('Assessment assigned!');
	// 	// 	$location.path('/assments/assessment/' + newAssessmentData.assessment_ID + '001');
	// 	// }, function(reason) {
	// 	// 	rgiNotifier.error(reason);
	// 	// });


	// 	// rgiAnswerMethodSrvc.insertAnswerSet(newAnswerSet).then(function() {
	// 	// 	rgiNotifier.notify('Assessment assigned!');
	// 	// 	$location.path('/assments/assessment/{{assessment.assessment_ID}}001');
	// 	// }, function(reason) {
	// 	// 	rgiNotifier.error(reason);
	// 	// });
	}

	
});

angular.module('app').filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
});

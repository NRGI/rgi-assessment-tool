angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, $routeParams, $q, rgiNotifier, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiUserSrvc, rgiUserMethodSrvc, rgiQuestionSrvc){
	
	function zeroFill( number, width ) {
		width -= number.toString().length;
		if ( width > 0 ) {
			return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		}
		return number + ""; // always return a string
	};

	// get all researchers
	$scope.researchers = rgiUserSrvc.query({roles:'researcher'});
	// get all reviewers
	$scope.reviewers = rgiUserSrvc.query({roles:'reviewer'});
	
	// get assessment that needs to be updated
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
	// get questions for insertion into answers collection
	$scope.questions = rgiQuestionSrvc.query();

	$scope.assessmentAssign = function() {
		
		// var newResearcherData = $scope.researcherSelect;
		// var newReviewerData = $scope.reviewerSelect;
		// newResearcherData.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country, assigned: {value:true}});
		// newReviewerData.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country, assigned: {value:true}});

		// rgiUserMethodSrvc.updateUser(newResearcherData).then(function() {
		// 	rgiNotifier.notify('User account has been updated');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// });

		// rgiUserMethodSrvc.updateUser(newReviewerData).then(function() {
		// 	rgiNotifier.notify('User account has been updated');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// });

		// var newAssessmentData = $scope.assessment;
		// newAssessmentData.status = "assigned";
		// newAssessmentData.researcher_ID = $scope.researcherSelect._id;
		// newAssessmentData.reviewer_ID = $scope.reviewerSelect._id;
		// newAssessmentData.edit_control = "researcher";

		// rgiAssessmentMethodSrvc.updateAssessment(newAssessmentData).then(function() {
		// 	rgiNotifier.notify('Assessment created and assigned!');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// });

		var newAnswerSet = [];

		for (var i = 0; i < $scope.questions.length; i++) {
			newAnswerSet.push({});

			newAnswerSet[i].answer_ID = $routeParams.assessment_ID + zeroFill($scope.questions[i].question_order, 3);
			newAnswerSet[i].question_ID = $scope.questions[i]._id;
			newAnswerSet[i].assessment_ID = $routeParams.assessment_ID;
			newAnswerSet[i].researcher_ID = $scope.researcherSelect._id;
			newAnswerSet[i].reviewer_ID = $scope.reviewerSelect._id;
			newAnswerSet[i].question_order = $scope.questions[i].question_order;
			newAnswerSet[i].component = $scope.questions[i].component;
		};
		console.log(newAnswerSet);

		// rgiAnswerMethodSrvc.updateAnswerSet(newAnswerSet).then(function() {
		// 	rgiNotifier.notify('Assessment assigned!');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// });
	}

	// $scope.assessmentCreate = function() {
	// 	// create assessment document
	// 		// assessment_ID = iso3 of country_name
	// 		// country = string name
	// 		// // figure out npm country codes modules to make this easier - https://github.com/sripaulgit/country-codes/blob/master/test.js
	// }
});
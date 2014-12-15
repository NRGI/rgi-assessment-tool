angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, $routeParams, $q, rgiNotifier, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiUserSrvc, rgiUserMethodSrvc, rgiQuestionSrvc){
	// get all researchers
	$scope.researchers = rgiUserSrvc.query({roles:'researcher'});
	// get all reviewers
	$scope.reviewers = rgiUserSrvc.query({roles:'reviewer'});
	
	// get assessment that needs to be updated
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
	// get questions for insertion into answers collection
	$scope.questions = rgiQuestionSrvc.query();

	$scope.assessmentAssign = function() {
		
		// newResearcherData = $scope.researcherSelect;
		// newReviewerData = $scope.reviewerSelect;

		// newAssessmentData = $scope.assessment;
		// newAssessmentData.status = "assigned";
		// newAssessmentData.researcher_ID = $scope.researcherSelect._id;
		// newAssessmentData.reviewer_ID = $scope.reviewerSelect._id;
		// newAssessmentData.edit_control = "researcher";

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
		
		// rgiAssessmentMethodSrvc.updateAssessment(newAssessmentData).then(function() {
		// 	rgiNotifier.notify('Assessment created and assigned!');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// });
		

	

		// create answers
		// 	for each question in question collection
		// 		set answer_ID = assessment.assessment_id + questions.question_order
		// 		set question_ID = questions._id
		// 		set assessment_ID = assessment.assessment_id
		// 		set researcher_ID = researcher_ID
		// 		set reviewer_ID = reviewer_ID
		// 		set question_order
		// 		set component
		// 		set status
	

	

	}




	

	

	// $scope.assessmentCreate = function() {
	// 	// create assessment document
	// 		// assessment_ID = iso3 of country_name
	// 		// country = string name
	// 		// // figure out npm country codes modules to make this easier - https://github.com/sripaulgit/country-codes/blob/master/test.js
	// }
});




// $scope.createUser = function() {
//     var newUserData = {
//       firstName: $scope.fname,
//       lastName: $scope.lname,
//       username: $scope.username,
//       email: $scope.email,
//       password: $scope.password,
//       roles: [$scope.roles],
//       // // Need to create creation event
//       // creation: {createdBy: user id, createdDate: Date.now},
//       address: [$scope.address],
//       language: [$scope.language]
//     };

//     rgiAuthSrvc.createUser(newUserData).then(function() {
//       rgiNotifier.notify('User account created!');
//       $location.path('/');
//     }, function(reason) {
//       rgiNotifier.error(reason);
//     })
//   }
angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, rgiAssessmentSrvc, rgiUserListSrvc, rgiUserRoleSrvc, rgiQuestionSrvc, $routeParams, $q){
	// get all researchers
	$scope.researchers = rgiUserRoleSrvc.get({role:'researcher'});
	// get all reviewers
	$scope.reviewers = rgiUserRoleSrvc.get({role:'reviewer'});
	// get assessment that needs to be updated
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
	// get questions for insertion into answers collection
	$scope.questions = rgiQuestionSrvc.query();

	$scope.assessmentAssign = function() {
		// update user records for reviewer and researcher
		// 	insert new subdoc in assessments array
		// 		{
		// 			assessment_id
		// 			country_name
		// 		}
		// update assessment record
		// 	set researcher_ID, reviewer_ID
		// 	change status to 'assigned'
		// 	set edit control to researcher_ID
		// 	set assign_date to timestamp

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

	$scope.assessmentCreate = function() {
		// create assessment document
			// assessment_ID = iso3 of country_name
			// country = string name
			// // figure out npm country codes modules to make this easier - https://github.com/sripaulgit/country-codes/blob/master/test.js
	}
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
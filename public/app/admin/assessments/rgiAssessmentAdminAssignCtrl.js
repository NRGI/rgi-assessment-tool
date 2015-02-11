angular.module('app').controller('rgiAssessmentAdminAssignCtrl', function($scope, $routeParams, $q, $location, rgiNotifier, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiUserSrvc, rgiUserMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc){
	
	function zeroFill( number, width ) {
		width -= number.toString().length;
		if ( width > 0 ) {
			return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		}
		return number + ""; // always return a string
	}

	// get all researchers
	$scope.researchers = rgiUserSrvc.query({roles:'researcher'});
	// get all reviewers
	$scope.reviewers = rgiUserSrvc.query({roles:'reviewer'});
	
	// get assessment that needs to be updated
	$scope.assessment = rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID});
	
	// get questions for insertion into answers collection
	$scope.questions = rgiQuestionSrvc.query();

	$scope.assessmentAssign = function() {
		// update users
		var new_researcher_data = $scope.researcherSelect;
		var new_reviewer_data = $scope.reviewerSelect;
		// new_researcher_data.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country, assigned: {value:true}});
		new_researcher_data.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country});
		// new_reviewer_data.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country, assigned: {value:true}});
		new_reviewer_data.assessments.push({assessment_id: $routeParams.assessment_ID, country_name: $scope.assessment.country});

		// update assessment
		var new_assessment_data = $scope.assessment;
		new_assessment_data.status = 'assigned';
		new_assessment_data.researcher_ID = $scope.researcherSelect._id;
		new_assessment_data.reviewer_ID = $scope.reviewerSelect._id;
		new_assessment_data.edit_control = 'researcher';

		// create new answer set
		var new_answer_set = [];

		for (var i = 0; i < $scope.questions.length; i++) {
			new_answer_set.push({});

			if($scope.questions[i].hasOwnProperty('question_order')){
				new_answer_set[i].answer_ID = $routeParams.assessment_ID + String(zeroFill($scope.questions[i].question_order, 3));
				new_answer_set[i].question_ID = $scope.questions[i]._id;
				new_answer_set[i].assessment_ID = $routeParams.assessment_ID;
				new_answer_set[i].researcher_ID = $scope.researcherSelect._id;
				new_answer_set[i].reviewer_ID = $scope.reviewerSelect._id;
				new_answer_set[i].question_order = $scope.questions[i].question_order;
				new_answer_set[i].component_id = $scope.questions[i].component;
				new_answer_set[i].component_text = $scope.questions[i].component_text;
				new_answer_set[i].nrc_precept = $scope.questions[i].nrc_precept;
			}
		};

		// send to mongo
		rgiUserMethodSrvc.updateUser(new_researcher_data)
			.then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
			.then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
			.then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
			.then(function() {
				$location.path('/admin/assessment-admin');
				rgiNotifier.notify('Assessment created and assigned!');
			}, function(reason) {
				rgiNotifier.error(reason);
			});

	}
});
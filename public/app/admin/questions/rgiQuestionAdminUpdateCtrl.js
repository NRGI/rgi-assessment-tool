angular.module('app').controller('rgiQuestionAdminUpdateCtrl', function($scope, $routeParams, rgiQuestionMethodSrvc, rgiQuestionSrvc) {

	$scope.question = rgiQuestionSrvc.get({_id:$routeParams.id});

	// $scope.roleOptions = [
 //    {value:'admin',text:'Administrator'},
 //    {value:'supervisor',text:'Supervisor'},
 //    {value:'researcher',text:'Researcher'},
 //    {value:'reviewer',text:'Reviewer'}
 //    // {value:'external',text:'External Reviewer (i.e. company, national gov, etc.)'},
 //    // {value:'',text:''}
 //  ]

	$scope.questionUpdate = function() {
		var newQuestionData = $scope.question;

		// rgiQuestionMethodSrvc.updateQuestion(newQuestionData).then(function() {
		// 	rgiNotifier.notify('Question data has been updated');
		// }, function(reason) {
		// 	rgiNotifier.error(reason);
		// }
	}
		// 
		// 
		// 	
		// }, 
		// 	
		// }
	

	$scope.questionOptionAdd = function() {
		$scope.question.question_choices.push({});
	}

	// // Add update button functionality
	// $scope.questionUpdate = function() {
	// 	
	// 	});


// var newUserData = $scope.user;

// 		if($scope.password && $scope.password.length > 0) {
// 			if($scope.password === $scope.password_rep) {
// 				newUserData.password = $scope.password;
// 				rgiAuthSrvc.updateUser(newUserData).then(function() {
// 					rgiNotifier.notify('User account has been updated');
// 				}, function(reason) {
// 					rgiNotifier.error(reason);
// 				});
// 			}else{
// 				rgiNotifier.error('Passwords must match!')
// 			}
// 		} else {
// 			rgiAuthSrvc.updateUser(newUserData).then(function() {
// 				rgiNotifier.notify('User account has been updated');
// 			}, function(reason) {
// 				rgiNotifier.error(reason);
// 			});
// 		};
	// }
});
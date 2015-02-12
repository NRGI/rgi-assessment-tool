angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiQuestionSrvc) {

    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.a = angular.copy($scope.answer);
    });

    $scope.answerClear = function () {
        $scope.answer_choice_form.$setPristine(true);
        $scope.new_comment_form.$setPristine(true);

        $scope.answer = angular.copy($scope.answer_start);
    };

    $scope.answerSave = function () {
    	console.log($scope);
        // var new_answer_data = $scope.answer;
        // new_answer_data.comments.push({content: new_answer_data.new_comment});
        // answer.new_comment
        // var commentSchema = new mongoose.Schema({
        //     date: {type: Date, default: Date.now},
        //     content: String,
        //     author: ObjectId, // Pull from curretn user _id value
        //     author_name: String,
        //     // ACTUAL CHANGE
        //     role: String
        // });
// citation
// upload_date: {type: Date, default: Date.now},
//     upload_URL: String, // generated from upload path in S3
//     upload_note: String,
//     upload_user_id: ObjectId,
//     citation: {
//         source_URL: String,
//         authors: [{first_name: String, last_name: String}],
//         title: String,
//         publish_year: String
//     }
    };

    // $scope.answerSubmit = function () {
    //     console.log();
    // };

    // $scope.answerSubmit = function () {
    //     console.log();
    // };

    // $scope.answerSubmit = function () {
    //     console.log();
    // };

    // $scope.answerSubmit = function () {
    //     console.log();
    // };



    // $scope.userCreate = function () {
    //     var newUserData = {
    //       firstName: $scope.fname,
    //       lastName: $scope.lname,
    //       username: $scope.username,
    //       email: $scope.email,
    //       password: $scope.password,
    //       // ADD ROLE IN CREATION EVENT
    //       roles: [$scope.roleSelect],
    //       address: [$scope.address],
    //       language: [$scope.language]
    //     };

    //     rgiUserMethodSrvc.createUser(newUserData).then(function () {
    //       // rgiMailer.send($scope.email);
    //       rgiNotifier.notify('User account created!' + $scope.email);
    //       $location.path('/admin/user-admin');
    //     }, function (reason) {
    //       rgiNotifier.error(reason);
    //     })
    //   }

   

});





// angular.module('app').controller('rgiAssessmentDetailCtrl', function ($scope, $routeParams, rgiAssessmentSrvc, rgiUserListSrvc, rgiAnswerSrvc, rgiQuestionSrvc, rgiQuestionTextSrvc) {
    
//     rgiAssessmentSrvc.get({assessment_ID:$routeParams.assessment_ID},function (assessment_data) {
//         $scope.assessment = assessment_data;
//         $scope.assessment.reviewer = rgiUserListSrvc.get({_id:assessment_data.reviewer_ID});
//         $scope.assessment.researcher = rgiUserListSrvc.get({_id:assessment_data.researcher_ID});
//         $scope.answers = [];
//         rgiAnswerSrvc.query({assessment_ID:assessment_data.assessment_ID}, function (answer_data) {
//             for (var i = 0; i < answer_data.length; i++) {
//                 answer = answer_data[i];
//                 answer.question_text = rgiQuestionTextSrvc.get({_id:answer.question_ID});
//                 $scope.answers.push(answer);
//             };
//         });
//     });
// })
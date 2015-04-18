angular.module('app').controller('rgiMoveAssessmentDialogCtrl', function ($scope, $location, rgiNotifier, ngDialog, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiQuestionMethodSrvc, rgiUserListSrvc) {

	// get current control profile onto scope and use it to populate workflowopts
    console.log($scope.$parent.assessment.questions_flagged);
    console.log($scope.$parent.assessment.edit_control);
    

    rgiUserListSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
        var workflowOpts = [];
        workflowOpts.push({
            text: 'Send back to ' + control_profile.firstName + control_profile.lastName + ' (' + control_profile.role + ') for review.',
            value: 'review_' + control_profile.role
        });

        if (control_profile.role === 'researcher' && $scope.$parent.assessment.questions_flagged === 0) {
            rgiUserListSrvc.get({_id: $scope.$parent.assessment.reviewer_ID}, function (new_profile) { 
                workflowOpts.push({
                    text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                    value: 'assigned_' + new_profile.role
                }); 
            });
        } else if (control_profile.role === 'reviewer' && $scope.$parent.assessment.questions_flagged === 0) {
            rgiUserListSrvc.get({_id: $scope.$parent.assessment.researcher_ID}, function (new_profile) { 
                workflowOpts.push({
                    text: 'Move to ' + new_profile.firstName + " " + new_profile.lastName + ' (' + new_profile.role + ').',
                    value: 'assigned_' + new_profile.role
                }); 
            });
        }

        if ($scope.$parent.assessment.status === 'approved') {
            workflowOpts.push({
                text: 'Move to internal review',
                value: 'internal_review'
            });
            workflowOpts.push({
                text: 'Move to external review',
                value: 'external_review'
            });
            workflowOpts.push({
                text: 'Final approval',
                value: 'final_approval'
            });
        }
        
        $scope.workflowOpts = workflowOpts;

    });

    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.assessmentMove = function () {
    	switch($scope.action){
    		case 'review_researcher':
    			console.log('send back to researcher');
    			// check if current edit control = researcher id
    				// if not reply that 
    			// update assessments
    			break;
    		case 'review_reviewer':
    			console.log('send back to reviewer');
    			// check if current edit control = reviewer id
    			// update assessments
    			break;
    		case 'assigned_researcher':
    			console.log('send over to researcher');
    			break;
    		case 'assigned_reviewer':
    			console.log('send over to reviewer');
    			// check if current edit control = researcher id
    			// update assessments
    			break;
    		case 'internal_review':
    			console.log('send over to internal review');
    			break;
    		case 'external_review':
    			console.log('send over to external review');
    			break;
    		case 'final_approval':
    			console.log('final approval');
    			break;
    		default:
    			console.log('broke');
    			break;
    	}
    };

    // $scope.returnAssessment = function () {
    //     console.log('return');
    // };
    
    // $scope.approveAssessment = function () {
    //     console.log('approve');
    // };

    // // Deploy new assessment
    // $scope.newAssessmentDialog = function () {
    //     $scope.value = true;
    //     ngDialog.open({
    //         template: 'partials/admin/assessments/new-assessment-dialog',
    //         controller: 'assessmentDialogCtrl',
    //         className: 'ngdialog-theme-plain',
    //         scope: $scope
    //     });

    // $scope.assessmentSubmit = function () {
    //     var new_assessment_data = new rgiAssessmentSrvc($scope.assessment);

    //     new_assessment_data.status = 'submitted';
    //     new_assessment_data.questions_complete = 0;

    //     rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
    //         .then(function () {
    //             $location.path('/assessments');
    //             rgiNotifier.notify('Assessment submitted!');
    //         }, function (reason) {
    //             rgiNotifier.error(reason);
    //         });
    // };
    


    // $scope.assessmentDeploy = function () {
    //     var newAssessmentData = [],
    //         newQuestionData = [];

    //     rgiQuestionSrvc.query({assessment_ID: 'base'}, function (data) {

    //         $scope.new_assessment.assessment_countries.forEach(function (el, i) {
    //             newAssessmentData.push({
    //                 assessment_ID: el.country.iso2 + "-" + String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
    //                 ISO3: el.country.iso3,
    //                 year: $scope.new_assessment.year,
    //                 version: $scope.new_assessment.version,
    //                 country: el.country.country,
    //                 question_length: data.length
    //             });
    //         });
    //         console.log($scope.new_assessment);

    //         data.forEach(function (el, i) {
    //             newQuestionData.push({
    //                 root_question_ID: el._id,
    //                 year: String($scope.new_assessment.year),
    //                 version: $scope.new_assessment.version,
    //                 assessment_ID: String($scope.new_assessment.year) + "-" + $scope.new_assessment.version.slice(0, 2).toUpperCase(),
    //                 component: el.component,
    //                 component_text: el.component_text,
    //                 indicator_name: el.indicator_name,
    //                 nrc_precept: el.nrc_precept,
    //                 old_reference: el.old_reference,
    //                 question_order: el.question_order,
    //                 question_choices: [],
    //                 question_text: el.question_text,
    //                 section_name: el.section_name,
    //                 sub_indicator_name: el.sub_indicator_name
    //             });

    //             el.question_choices.forEach(function (q_el, j) {
    //                 newQuestionData[newQuestionData.length - 1].question_choices.push({'criteria': q_el.criteria, 'name': q_el.name, 'order': q_el.order});
    //             });
    //         });

    //         // send to mongo
    //         rgiAssessmentMethodSrvc.createAssessment(newAssessmentData)
    //             .then(rgiQuestionMethodSrvc.insertQuestionSet(newQuestionData))
    //             .then(function () {
    //                 rgiNotifier.notify('Assessment deployed!');
    //                 $scope.closeThisDialog();
    //                 $location.path('/admin/assessment-admin');
    //             }, function (reason) {
    //                 rgiNotifier.error(reason);
    //             });
    //     });
    // };
});
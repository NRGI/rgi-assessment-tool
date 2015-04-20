'use strict';
var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiMoveAssessmentDialogCtrl', function ($scope, $location, rgiNotifier, ngDialog, rgiIdentitySrvc, rgiAssessmentMethodSrvc, rgiAnswerSrvc, rgiUserListSrvc, rgiAssessmentSrvc, rgiAnswerMethodSrvc) {

    // get current control profile onto scope and use it to populate workflowopts


    rgiUserListSrvc.get({_id: $scope.$parent.assessment.edit_control}, function (control_profile) {
        var workflowOpts = [];
        if ($scope.$parent.assessment.status !== 'approved') {
            workflowOpts.push({
                text: 'Send back to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ') for review.',
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
        }

       

        if ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.questions_unfinalized === 0 && $scope.$parent.assessment.status !== 'approved') {
             workflowOpts.push({
                text: 'Approve assessment',
                value: 'approved'
            });
        }

        // workflowOpts.push({
        //     text: 'Move to ' + control_profile.firstName + " " + control_profile.lastName + ' (' + control_profile.role + ').',
        //     value: ''
        // }); 

        if ($scope.$parent.assessment.status === 'approved' || ($scope.$parent.assessment.questions_flagged === 0 && $scope.$parent.assessment.status === 'under_review')) {
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
        // } else {
        //     workflowOpts.push({
        //         text: 'Move to internal review',
        //         value: ''
        //     });
        //     workflowOpts.push({

        //         text: 'Move to external review',

        //         value: ''
        //     });
        //     workflowOpts.push({
        //         text: 'Final approval',
        //         value: ''
        //     });
        // }
        $scope.workflowOpts = workflowOpts;

    });

    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.assessmentMove = function () {
        var r, new_assessment_data, new_answer_data;

        switch ($scope.action) {

        case 'review_researcher':
            r = confirm('Send back to researcher?');

            if (r === true) {
                new_assessment_data = new rgiAssessmentSrvc($scope.$parent.assessment);

                new_assessment_data.status = 'review_researcher';

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $location.path('/admin/assessment-admin');
                        rgiNotifier.notify('Assessment returned!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
            // send email to researcher
            // update assessments

            break;

        case 'review_reviewer':
            r = confirm('Send back to reviewer?');

            if (r === true) {
                new_assessment_data = new rgiAssessmentSrvc($scope.$parent.assessment);
                new_assessment_data.status = 'review_reviewer';

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $location.path('/admin/assessment-admin');
                        rgiNotifier.notify('Assessment returned!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
            // send email to reviewer
            // update assessments
            break;

        case 'assigned_researcher':
            r = confirm('Send on to researcher?');
            if (r === true) {
                new_assessment_data = new rgiAssessmentSrvc($scope.$parent.assessment);

                new_assessment_data.status = 'assigned_researcher';
                new_assessment_data.questions_complete = 0;
                new_assessment_data.edit_control = new_assessment_data.researcher_ID;

                rgiAnswerSrvc.query({assessment_ID: $scope.$parent.assessment.assessment_ID}, function (new_answer_data) {
                    new_answer_data.forEach(function (el, i) {
                        el.status = 'assigned';
                    });

                    rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                        .then(rgiAnswerMethodSrvc.updateAnswerSet(new_answer_data))
                        .then(function () {
                            $location.path('/admin/assessment-admin');
                            rgiNotifier.notify('Assessment moved forward!');
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                });
            }

            break;

        case 'approved':
            r = confirm('Approve assessment?');
            if (r === true) {
                new_assessment_data = new rgiAssessmentSrvc($scope.$parent.assessment);

                new_assessment_data.status = 'approved';
                new_assessment_data.edit_control = rgiIdentitySrvc.currentUser._id;

                rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                    .then(function () {
                        $location.path('/admin/assessment-admin');
                        rgiNotifier.notify('Assessment moved forward!');
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }

            break;

        case 'assigned_reviewer':
            r = confirm('Send on to reviewer?');
            if (r === true) {
                new_assessment_data = new rgiAssessmentSrvc($scope.$parent.assessment);

                new_assessment_data.status = 'assigned_reviewer';
                new_assessment_data.questions_complete = 0;
                new_assessment_data.edit_control = new_assessment_data.reviewer_ID;

                rgiAnswerSrvc.query({assessment_ID: $scope.$parent.assessment.assessment_ID}, function (new_answer_data) {
                    new_answer_data.forEach(function (el, i) {
                        el.status = 'assigned';
                    });

                    rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data)
                        .then(rgiAnswerMethodSrvc.updateAnswerSet(new_answer_data))
                        .then(function () {
                            $location.path('/admin/assessment-admin');
                            rgiNotifier.notify('Assessment moved forward!');
                        }, function (reason) {
                            rgiNotifier.error(reason);
                        });
                });
            }
            // send email to reviewer
            // update assessments
            break;
        case 'internal_review':
            r = confirm('Send to internal reviewer?');

            if (r === true) {
                new_assessment_data.first_pass = false;

            }
            break;

        case 'external_review':
            r = confirm('Send to external reviewer?');
            if (r === true) {
                console.log(r);
            }
            break;

        case 'final_approval':
            r = confirm('Final approval?');
            if (r === true) {
                console.log(r);
            }
            break;
        default:
            console.log('broke');
            break;
        }
        ngDialog.close();
    };

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
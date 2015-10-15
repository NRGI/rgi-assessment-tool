function zeroFill(number, width) {
    'use strict';
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}
angular
    .module('app')
    .controller('rgiAssignAssessmentDialogCtrl', function (
        $scope,
        $location,
        ngDialog,
        rgiNotifier,
        rgiIdentitySrvc,
        rgiAssessmentSrvc,
        rgiAssessmentMethodSrvc,
        rgiUserSrvc,
        rgiUserMethodSrvc,
        rgiAnswerMethodSrvc,
        rgiQuestionSrvc
    ) {
        'use strict';
        // get all researchers
        $scope.researchers = rgiUserSrvc.query({role: 'researcher'});
        // get all reviewers
        $scope.reviewers = rgiUserSrvc.query({role: 'reviewer'});

        // get assessment that needs to be updated
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: $scope.$parent.assessment_update_ID});

        // get questions for insertion into answers collection
        $scope.questions = rgiQuestionSrvc.query({assessment_ID: $scope.$parent.assessment_update_ID.substr(3)});

        $scope.assessmentAssign = function () {
            // update users
            var new_researcher_data = $scope.researcherSelect,
                new_reviewer_data = $scope.reviewerSelect,
                new_assessment_data = $scope.assessment,
                new_answer_set = [];
                //current_user = rgiIdentitySrvc.currentUser;

            //MAIL NOTIFICATION
            new_assessment_data.mail = true;

            // UPDATE ASSESSMENT AND ASSIGN ALL SCENERIOS
            new_assessment_data.status = 'assigned';
            new_assessment_data.researcher_ID = new_researcher_data._id;
            new_assessment_data.edit_control = new_researcher_data._id;
            new_researcher_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});

            //IF REVIEWER SELECTED
            if (new_reviewer_data) {
                new_assessment_data.reviewer_ID = new_reviewer_data._id;
                new_reviewer_data.assessments.push({assessment_ID: $scope.$parent.assessment_update_ID, country_name: $scope.assessment.country, year: $scope.assessment.year, version: $scope.assessment.version});
            }

            //TODO HANDLE NEW QUESTION TYPES
            // CREATE NEW ANSWER SET
            $scope.questions.forEach(function (el, i) {
                new_answer_set.push({});

                if (el.hasOwnProperty('question_order')) {
                    new_answer_set[i].answer_ID = $scope.$parent.assessment_update_ID + '-' + String(zeroFill(el.question_order, 3));
                    new_answer_set[i].question_ID = el._id;
                    new_answer_set[i].root_question_ID = el.root_question_ID;
                    new_answer_set[i].assessment_ID = $scope.$parent.assessment_update_ID;
                    new_answer_set[i].year = el.year;
                    new_answer_set[i].version = el.version;
                    new_answer_set[i].researcher_ID = new_researcher_data._id;
                    new_answer_set[i].edit_control = new_researcher_data._id;
                    new_answer_set[i].question_order = el.question_order;
                    new_answer_set[i].question_text = el.question_text;
                    new_answer_set[i].component = el.component;
                    new_answer_set[i].component_text = el.component_text;
                    new_answer_set[i].nrc_precept = el.nrc_precept;
                }
                if (new_reviewer_data) {
                    new_answer_set[i].reviewer_ID = new_reviewer_data._id;
                }
            });
            console.log(new_reviewer_data);
            console.log(new_researcher_data);
            console.log(new_assessment_data);
            console.log(new_answer_set);

            ////TODO DEAL WITH RELOADING NOT ALWAYS WORKING  - DUPLICATE ANSWER SETS
            if (new_reviewer_data) {
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiUserMethodSrvc.updateUser(new_reviewer_data))
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                    .then(function () {
                        rgiNotifier.notify('Assessment created and assigned!');
                        $location.path('/');
                        //$route.reload();
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            } else if (!new_reviewer_data) {
                rgiUserMethodSrvc.updateUser(new_researcher_data)
                    .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
                    .then(rgiAnswerMethodSrvc.insertAnswerSet(new_answer_set))
                    .then(function () {
                        rgiNotifier.notify('Assessment created and assigned!');
                        $location.path('/');
                        //$route.reload();
                        $scope.closeThisDialog();
                    }, function (reason) {
                        rgiNotifier.error(reason);
                    });
            }
        };
        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });
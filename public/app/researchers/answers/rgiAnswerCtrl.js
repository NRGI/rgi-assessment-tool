'use strict';
//var angular;
/*jslint nomen: true*/

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}

angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, $q, $location, ngDialog, FileUploader, rgiAnswerSrvc, rgiDocumentSrvc, rgiDocumentMethodSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier) {
    $scope.identity = rgiIdentitySrvc;
    $scope.ref_type = [
        {text: 'Add Document', value: 'document'},
        {text: 'Add Webpage', value: 'webpage'},
        {text: 'Add Interview', value: 'interview'}
    ];
    //DATEPICKER OPTS
    $scope.date_format = 'MMMM d, yyyy';
    var today = new Date();
    $scope.date_default = today;
    $scope.date_max_limit = today;



    $scope.moveForward = function () {
        if ($scope.identity.currentUser._id === $scope.assessment.edit_control) {
            $location.path('/assessments/assessment-edit/' + $scope.assessment.assessment_ID + "-" + String(zeroFill($scope.answer.question_order + 1, 3)));
        } else {
            $location.path('/assessments/assessment-view/' + $scope.assessment.assessment_ID + "-" + String(zeroFill($scope.answer.question_order + 1, 3)));
        }
    };
    $scope.moveBackward = function () {
        if ($scope.identity.currentUser._id === $scope.assessment.edit_control) {
            $location.path('/assessments/assessment-edit/' + $scope.assessment.assessment_ID + "-" + String(zeroFill($scope.answer.question_order - 1, 3)));
        } else {
            $location.path('/assessments/assessment-view/' + $scope.assessment.assessment_ID + "-" + String(zeroFill($scope.answer.question_order - 1, 3)));
        }
    };

    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        $scope.answer_start = angular.copy($scope.answer);

        var citations = [];

        data.references.citation.forEach(function (el) {
            rgiDocumentSrvc.get({_id: el.document_ID}, function (doc) {
                doc.comment = el.comment;
                citations.push(doc);
            });
        });
        $scope.citations = citations;

    });

    $scope.answerClear = function () {
        $scope.answer = angular.copy($scope.answer_start);
    };

    $scope.answerSave = function () {
        var new_answer_data = $scope.answer;

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Answer saved');
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };

    $scope.answerSubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status !== 'submitted') {
            new_answer_data.status = 'submitted';
            new_assessment_data.questions_complete += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_assessment_data.questions_complete !== new_assessment_data.question_length && new_answer_data.question_order !== new_assessment_data.question_length) {
                    $location.path('/assessments/assessment-edit/' + new_answer_data.assessment_ID + "-" + String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/assessments/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer submitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.commentSubmit = function (current_user) {
        var new_comment_data = {
                content: $scope.answer.new_comment,
                author_name: current_user.firstName + ' ' + current_user.lastName,
                author: current_user._id,
                role: current_user.role,
                date: new Date().toISOString()
            },
            new_answer_data = $scope.answer;

        new_answer_data.comments.push(new_comment_data);

        if (new_answer_data.status === 'assigned') {
            new_answer_data.status = 'saved';
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('Comment added');
            $scope.answer.new_comment = undefined;
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
    };
    //TODO Generate Dialog based on change and handle upload process via dialogs
    $scope.select_ref_dialog = function(value) {
        var template = 'partials/dialogs/new-ref-' + $scope.ref_selection + '-dialog';
        //console.log(template);
        ngDialog.open({
            template: template,
            controller: 'rgiNewRefDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };

    //Citation functions
    // Doc Upload specs
    var uploader = $scope.uploader = new FileUploader({
        isHTML5: true,
        withCredentials: true,
        url: 'file-upload'
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 1;
        }
    });
    //TODO handle doc and txt documents
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        if (status === 400) {
            $scope.uploader.queue = [];
            rgiNotifier.error(response.reason);
        } else {// TODO add cancel upload after initial document pass
            $scope.new_document = response;

            $scope.uploader.queue = [];

            $scope.value = true;
            ngDialog.open({
                template: 'partials/dialogs/new-document-dialog',
                controller: 'rgiNewDocumentDialogCtrl',
                className: 'ngdialog-theme-plain',
                scope: $scope
            });
        }

    };

    // Review functions
    $scope.flagCheck = function (flags) {
        var disabled = false;
        if (flags.length !== 0) {
            flags.forEach(function (el) {
                if (el.addressed === false) {
                    disabled = true;
                }
            });
        }
        return disabled;
    };

    $scope.answerFlag = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/dialogs/flag-answer-dialog',
            controller: 'rgiFlagAnswerDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };

    $scope.answerResubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status === 'flagged') {
            new_answer_data.status = 'resubmitted';
            new_assessment_data.questions_resubmitted += 1;
            new_assessment_data.questions_complete += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                $location.path('/assessments-review/' + new_answer_data.assessment_ID);
                rgiNotifier.notify('Answer resubmitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.answerApprove = function () {
        var new_answer_data, new_assessment_data;
        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_assessment_data.status === 'submitted') {
            if (new_answer_data.status === 'flagged') {
                new_answer_data.status = 'approved';
                new_assessment_data.questions_flagged -= 1;
                new_assessment_data.questions_complete += 1;
            } else if (new_answer_data.status !== 'approved') {
                new_answer_data.status = 'approved';
                new_assessment_data.questions_complete += 1;
            }
        } else if (new_assessment_data.status === 'resubmitted') {
            if (new_answer_data.status === 'flagged') {
                new_answer_data.status = 'approved';
                new_assessment_data.questions_flagged -= 1;
            }
        }
        if (new_answer_data.status === 'submitted') {
            new_answer_data.status = 'approved';
            new_assessment_data.questions_complete += 1;
        } else if (new_answer_data.status === 'flagged' || new_answer_data.status === 'resubmitted') {
            new_answer_data.status = 'approved';
            new_assessment_data.questions_flagged -= 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.question_order !== new_assessment_data.question_length && new_assessment_data.status !== 'resubmitted') {
                    $location.path('admin/assessment-review/answer-review-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/admin/assessment-review/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer approved');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    // make final choice
    $scope.finalChoiceDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/admin/assessments/final-choice-dialog',
            controller: 'rgiFinalChoiceDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };
});

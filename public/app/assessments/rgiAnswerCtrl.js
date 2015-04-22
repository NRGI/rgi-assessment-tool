'use strict';
var angular;
/*jslint nomen: true*/

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array( width + (/\./.test(number) ? 2 : 1) ).join('0') + number;
    }
    return number + ""; // always return a string
}

angular.module('app').controller('rgiAnswerCtrl', function ($scope, $routeParams, ngDialog, FileUploader, rgiAnswerSrvc, rgiIdentitySrvc, rgiAssessmentSrvc, rgiAssessmentMethodSrvc, rgiQuestionSrvc, rgiAnswerMethodSrvc, rgiNotifier, $location) {
    $scope.identity = rgiIdentitySrvc;
    $scope.ref_type = [
        {text: 'Add Document', value: 'document'},
        {text: 'Add Webpage', value: 'web'},
        {text: 'Add Human Reference', value: 'human'}
    ];

    // var assessment_ID = $routeParams.answer_ID.substring(0,2);
    rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID, assessment_ID: $routeParams.answer_ID.substring(0, 2)}, function (data) {
        $scope.answer = data;
        $scope.assessment = rgiAssessmentSrvc.get({assessment_ID: data.assessment_ID});
        $scope.question = rgiQuestionSrvc.get({_id: data.question_ID});
        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.answer_start = angular.copy($scope.answer);
        $scope.answer_start = angular.copy($scope.answer);

    });

    var question = rgiAnswerSrvc.get({answer_ID: $routeParams.answer_ID});

    var uploader = $scope.uploader = new FileUploader({
        isHTML5: true,
        withCredentials: true,
        url: 'file-upload'
        // url: 'file-upload?assessment_id=' + $routeParams.answer_ID.substring(0, 10) + '&question_id=' + question._id + '&answer_id=' + $routeParams.answer_ID
        // url: 'file-upload?assessment_id=' + $routeParams.answer_ID.substring(0, 2) + '&question_id=' + $scope.question._id
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.new_document = response;
    };

    $scope.flagCheck = function (flags) {
        var disabled = false;
        if (flags.length !== 0) {
            flags.forEach(function (el, i) {
                if (el.addressed === false) {
                    disabled = true;
                }
            });
        }
        return disabled;
    };

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
                if (new_answer_data.question_order !== 4) {
                    $location.path('/assessments/assessment-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/assessments/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer submitted');
            }, function (reason) {
                rgiNotifier.notify(reason);
            });
    };

    $scope.answerResubmit = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

        if (new_answer_data.status === 'flagged') {
            new_answer_data.status = 'resubmitted';
            new_assessment_data.questions_resubmitted += 1;
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

    // make final choice
    $scope.uploadDocumentDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/assessments/new-document-dialog',
            controller: 'rgiNewDocumentDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };

    $scope.answerApprove = function () {
        var new_answer_data, new_assessment_data;

        new_answer_data = $scope.answer;
        new_assessment_data = $scope.assessment;

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
                if (new_answer_data.question_order !== 4 || new_assessment_data.status === 'resubmitted') {
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

    $scope.answerFlag = function (current_user) {
        var new_answer_data = $scope.answer, 
            new_assessment_data = $scope.assessment,
            new_flag_data = {
                content: $scope.answer.new_flag,
                author_name: current_user.firstName + ' ' + current_user.lastName,
                author: current_user._id,
                role: current_user.role,
                date: new Date().toISOString(),
                addressed: false
            };
        new_answer_data.flags.push(new_flag_data);

        if (new_answer_data.status === 'submitted') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_complete += 1;
            new_assessment_data.questions_flagged += 1;
        } else if (new_answer_data.status === 'resubmitted') {
            new_answer_data.status = 'flagged';

        } else if (new_answer_data.status === 'approved') {
            new_answer_data.status = 'flagged';
            new_assessment_data.questions_flagged += 1;
        }

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
            .then(rgiAssessmentMethodSrvc.updateAssessment(new_assessment_data))
            .then(function () {
                if (new_answer_data.question_order !== 4 || new_assessment_data.status === 'resubmitted') {
                    $location.path('admin/assessment-review/answer-review-edit/' + new_answer_data.assessment_ID + "-" +String(zeroFill((new_answer_data.question_order + 1), 3)));
                } else {
                    $location.path('/admin/assessment-review/' + new_answer_data.assessment_ID);
                }
                // $location.path();
                rgiNotifier.notify('Answer flagged');
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

    $scope.documentRefSubmit = function (current_user) {
        var new_answer_data = $scope.answer,
            new_doc_data = $scope.new_document,
            new_ref_data = {
                document_ID: new_doc_data._id,
                // mendeley_ID
                file_hash: new_doc_data.file_hash,
                    comment: {
                        date: new Date().toISOString(),
                        author: current_user._id,
                        author_name: current_user.firstName + ' ' + current_user.lastName,
                        role: current_user.role
                    }
                };
        if ($scope.answer.new_ref_comment !== undefined) {
            new_ref_data.comment.content = $scope.answer.new_ref_comment;
        }
        new_answer_data.references.citation.push(new_ref_data);

        // rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
        //     .then(rgiDocumentMethodSrvc.updateDocument(new_doc_data))
        //     .then(function () {
        //         rgiNotifier.notify('reference added');
        //         $scope.answer.web_ref_comment = "";
        //     }, function (reason) {
        //         rgiNotifier.notify(reason);
        //     });
    };

    $scope.webRefSubmit = function (current_user) {
        var new_answer_data = $scope.answer,

            new_ref_data = {
                title: $scope.answer.web_ref_title,
                URL: $scope.answer.web_ref_url,
                comment: {
                    date: new Date().toISOString(),
                    author: current_user._id,
                    author_name: current_user.firstName + ' ' + current_user.lastName,
                    role: current_user.role
                }
            };
        if ($scope.answer.web_ref_comment !== undefined) {
            new_ref_data.comment.content = $scope.answer.human_ref_comment;
        }
        new_answer_data.references.web.push(new_ref_data);

        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('reference added');
            $scope.answer.web_ref_comment = "";
        }, function (reason) {
            rgiNotifier.notify(reason);
        });
        // $scope.ref_selection = "";
        // $scope.answer.web_ref_title = "";
        // $scope.answer.web_ref_url = "";
        // $scope.answer.web_ref_comment = "";
    };

    $scope.humanRefSubmit = function (current_user) {
        var new_answer_data = $scope.answer,

            new_ref_data = {
                first_name: $scope.answer.human_ref_first_name,
                last_name: $scope.answer.human_ref_last_name,
                phone: $scope.answer.human_ref_phone,
                email: $scope.answer.human_ref_email,
                // contact_date: $scope.answer.human_ref_contact_date,
                contact_date: new Date().toISOString(),
                comment: {
                    date: new Date().toISOString(),
                    author: current_user._id,
                    author_name: current_user.firstName + ' ' + current_user.lastName,
                    role: current_user.role
                }
            };
        if ($scope.answer.human_ref_comment !== undefined) {
            new_ref_data.comment.content = $scope.answer.human_ref_comment;
        }
        new_answer_data.references.human.push(new_ref_data);


        rgiAnswerMethodSrvc.updateAnswer(new_answer_data).then(function () {
            rgiNotifier.notify('reference added');
            // $scope.answer.human_ref_first_name = "";
            // $scope.answer.human_ref_last_name = "";
            // $scope.answer.human_ref_phone = "";
            // $scope.answer.human_ref_email = "";
            // $scope.answer.human_ref_contact_date = "";
            // $scope.answer.human_ref_comment = "";
            $scope.ref_selection = "";
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
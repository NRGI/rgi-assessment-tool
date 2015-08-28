'use strict';
//var angular;
/*jslint nomen: true newcap: true unparam: true*/

angular.module('app').controller('rgiNewDocumentDialogCtrl', function ($scope, $route, ngDialog, rgiNotifier, rgiDocumentSrvc, rgiDocumentMethodSrvc, rgiAnswerMethodSrvc) {
    function isURLReal(fullyQualifiedURL) {
        var URL = encodeURIComponent(fullyQualifiedURL),
            dfd = $.Deferred(),
            checkURLPromise = $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22' + URL + '%22&format=json');

        checkURLPromise
            .done(function(res) {
                // results should be null if the page 404s or the domain doesn't work
                if (res.query.results) {
                    dfd.resolve(true);
                } else {
                    dfd.reject(false);
                }
            })
            .fail(function () {
                dfd.reject('failed');
            });
        return dfd.promise();
    }
    if ($scope.new_document.status === 'created') {
        $scope.new_document.authors = [{first_name: "", last_name: ""}];
        $scope.new_document.editors = [{first_name: "", last_name: ""}];
    }

    $scope.new_doc_type = [
        {value: 'journal', text: 'Journal'},
        {value: 'book', text: 'Book'},
        {value: 'generic', text: 'Generic'},
        {value: 'book_section', text: 'Book Section'},
        {value: 'conference_proceedings', text: 'Conference Proceedings'},
        {value: 'working_paper', text: 'Working Paper'},
        {value: 'report', text: 'Report'},
        {value: 'web_page', text: 'Web Page'},
        {value: 'thesis', text: 'Thesis'},
        {value: 'magazine_article', text: 'Magazine Article'},
        {value: 'statute', text: 'Statute'},
        {value: 'patent', text: 'Patent'},
        {value: 'newspaper_article', text: 'Newspaper Article'},
        {value: 'computer_program', text: 'Computer Program'},
        {value: 'hearing', text: 'Hearing'},
        {value: 'television_broadcast', text: 'Television Broadcast'},
        {value: 'encyclopedia_article', text: 'Encyclopedia Article'},
        {value: 'case', text: 'Case'},
        {value: 'film', text: 'Film'},
        {value: 'bill', text: 'Bill'}
    ];

    $scope.authorPush = function () {
        $scope.new_document.authors.push({first_name: "", last_name: ""});
    };

    $scope.editorPush = function () {
        $scope.new_document.editors.push({first_name: "", last_name: ""});
    };

    $scope.authorPop = function (index) {
        $scope.new_document.authors.splice(index, 1);
    };

    $scope.editorPop = function (index) {
        $scope.new_document.editors.splice(index, 1);
    };

    $scope.documentRefSubmit = function (new_document) {
        var url;
        //check for minimum data
        if ($scope.new_document.authors[0].first_name === "" || $scope.new_document.authors[0].last_name === "" || !$scope.new_document.title || !$scope.new_document.type) {
            rgiNotifier.error('You must provide at least a title, author and publication type!');
        } else {
        ////TODO check for proper url
        //} else if ($scope.new_document.source !== undefined) {
        //    if ($scope.new_document.source.split('://')[0] === 'http' || $scope.answer.web_ref_url.split('://')[0] === 'https') {
        //        url = $scope.new_document.source;
        //    } else {
        //        url = 'http://' + $scope.new_document.source;
        //    }
        //    //    url = $scope.answer.web_ref_url;
        //    //} else {
        //    //    url = 'http://' + $scope.answer.web_ref_url;
        //    //}
        //    //var url = ;
        //    //isURLReal(url)
        //    //    .fail(function (res) {
        //    //        rgiNotifier.error('Website does not exists');
        //    //    })
        //    //    .done(function (res) {
        //    //
        //    //    });
            var assessment_ID = $scope.$parent.assessment.assessment_ID,
                question_ID = $scope.$parent.question._id,
                answer_ID = $scope.$parent.answer.answer_ID,
                current_user_ID = $scope.$parent.current_user._id,
                current_user_name = $scope.$parent.current_user.firstName + ' ' + $scope.current_user.lastName,
                current_user_role = $scope.$parent.current_user.role,
                new_answer_data = $scope.$parent.answer,
                new_doc_data = new rgiDocumentSrvc(new_document),
                new_ref_data = {
                    document_ID: new_document._id,
                    // mendeley_ID
                    file_hash: new_document.file_hash,
                    comment: {
                        date: new Date().toISOString(),
                        author: current_user_ID,
                        author_name: current_user_name,
                        role: current_user_role
                    }
                };

            if (new_doc_data.status === 'created') {
                new_doc_data.status = 'submitted';
            }

            if (new_doc_data.assessments !== undefined && new_doc_data.assessments.indexOf(assessment_ID) < 0) {
                new_doc_data.assessments.push(assessment_ID);
            } else if (new_doc_data.assessments === undefined) {
                new_doc_data.assessments = [assessment_ID];
            }

            if (new_doc_data.questions !== undefined && new_doc_data.questions.indexOf(question_ID) < 0) {
                new_doc_data.questions.push(question_ID);
            } else if (new_doc_data.questions === undefined) {
                new_doc_data.questions = [question_ID];
            }

            if (new_doc_data.answers !== undefined && new_doc_data.answers.indexOf(answer_ID) < 0) {
                new_doc_data.answers.push(answer_ID);
            } else if (new_doc_data.answers === undefined) {
                new_doc_data.answers = [answer_ID];
            }

            if (new_doc_data.users !== undefined && new_doc_data.users.indexOf(current_user_ID) < 0) {
                new_doc_data.users.push(current_user_ID);
            } else if (new_doc_data.users === undefined) {
                new_doc_data.users = [current_user_ID];
            }

            if ($scope.answer.new_ref_comment !== undefined) {
                new_ref_data.comment.content = $scope.answer.new_ref_comment;
            }

            new_answer_data.references.citation.push(new_ref_data);

            rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                .then(rgiDocumentMethodSrvc.updateDocument(new_doc_data))
                .then(function () {
                    $scope.closeThisDialog();
                    rgiNotifier.notify('Reference added!');
                    $route.reload();
                }, function (reason) {
                    rgiNotifier.error(reason);
                });
        }
    };

    $scope.closeDialog = function () {
        ngDialog.close();
    };
});

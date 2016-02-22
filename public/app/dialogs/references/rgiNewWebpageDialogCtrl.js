'use strict';

angular.module('app')
    .controller('rgiNewWebpageDialogCtrl', function (
        $scope,
        $route,
        ngDialog,
        rgiUtilsSrvc,
        rgiNotifier,
        rgiDocumentSrvc,
        rgiDocumentMethodSrvc,
        rgiAnswerMethodSrvc,
        rgiUserMethodSrvc
    ) {
        $scope.current_user = $scope.$root.current_user;

        if ($scope.new_document.status === 'created') {
            $scope.new_document.authors = [{first_name: "", last_name: ""}];
        }
        $scope.new_document.type = 'web_page';
        $scope.submit_disabled = false;

        //DATEPICKER OPTS
        var today = new Date();
        $scope.date_default = today;
        $scope.date_max_limit = today;
        $scope.date_options = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.date_formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.date_format = $scope.date_formats[0];
        $scope.acc_status = {
            opened: false
        };
        $scope.pub_status = {
            opened: false
        };
        $scope.accCalOpen = function($event) {
            $scope.acc_status.opened = true;
        };
        $scope.pubCalOpen = function($event) {
            $scope.pub_status.opened = true;
        };

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
            var url, new_user_data = $scope.current_user;

            //check for minimum data
            if (!$scope.new_document.source) {
                rgiNotifier.error('You must provide a source URL!');
            } else if (!$scope.new_document.title) {
                rgiNotifier.error('You must provide a title!');
            } else if (!$scope.ref_date_accessed) {
                rgiNotifier.error('You must provide the date of access!');
            } else {
                if ($scope.new_document.source.split('://')[0] === 'http' || $scope.new_document.source.split('://')[0] === 'https') {
                    url = $scope.new_document.source;
                } else {
                    url = 'http://' + $scope.new_document.source;
                }
                rgiUtilsSrvc.isURLReal(url)
                    .fail(function (res) {
                        rgiNotifier.error('Website does not exists');
                    })
                    .done(function (res) {
                        $scope.submit_disabled=true;
                        var assessment_ID = $scope.$parent.assessment.assessment_ID,
                            question_ID = $scope.$parent.question._id,
                            answer_ID = $scope.$parent.answer.answer_ID,
                            current_user_ID = $scope.current_user._id,
                            new_answer_data = $scope.$parent.answer,
                            new_doc_data = new rgiDocumentSrvc(new_document),
                            new_ref_data = {
                                citation_type: 'document',
                                document_ID: new_document._id,
                                // mendeley_ID
                                file_hash: new_document.file_hash,
                                date_accessed: new Date($scope.ref_date_accessed).toISOString(),
                                author: current_user_ID
                            };

                        new_doc_data.source = url;

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
                            new_ref_data.comment = $scope.answer.new_ref_comment;
                        }

                        if (new_user_data.documents !== undefined && new_user_data.documents.indexOf(new_document._id) < 0) {
                            new_user_data.documents.push(new_document._id);
                        } else if (new_user_data.documents === undefined) {
                            new_user_data.documents = [new_document._id];
                        }

                        new_answer_data.references.push(new_ref_data);

                        rgiAnswerMethodSrvc.updateAnswer(new_answer_data)
                            .then(rgiDocumentMethodSrvc.updateDocument(new_doc_data))
                            .then(rgiUserMethodSrvc.updateUser(new_user_data))
                            .then(function () {
                                $scope.closeThisDialog();
                                rgiNotifier.notify('Reference added!');
                                $route.reload();
                            }, function (reason) {
                                rgiNotifier.error(reason);
                            });

                    });



                //    url = $scope.answer.web_ref_url;
                //} else {
                //    url = 'http://' + $scope.answer.web_ref_url;
                //}
                //var url = ;
                //
                ////TODO check for proper url
                //} else if ($scope.new_document.source !== undefined) {


            }
        };

        $scope.closeDialog = function () {
            ngDialog.close();
        };
    });

'use strict';

angular.module('app')
    .controller('rgiDocumentTableCtrl', function (
        _,
        $scope,
        $rootScope,
        rgiDialogFactory,
        rgiAssessmentSrvc,
        rgiDocumentSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiIdentitySrvc,
        rgiNotifier
    ) {
        var limit = 100,
            currentPage = 0,
            totalPages = 0;

        $scope.current_user = rgiIdentitySrvc.currentUser;
        $scope.busy = false;

        $scope.assessment_filter_options = [
            {value: 'all', text: 'Show all documents'}
            // {value: 'type', text: 'Sort by document type'},
            // {value: 'assessments', text: 'Sort by attached assessments'}
        ];

        $scope.assessment_filter = $scope.assessment_filter_options[0].value;

        rgiAssessmentSrvc.query({}, function (assessments) {
            if(assessments.reason) {
                rgiNotifier.error('No assessments');
            } else {
                assessments.forEach(function(assessment) {
                    console.log(assessment);
                    $scope.assessment_filter_options.push({
                        value: assessment.assessment_ID,
                        text: assessment.country + ' ' + assessment.year + ' ' + assessment.version
                    });
                });
            }
        });

        rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {
            if(response.reason) {
                rgiNotifier.error('Load document data failure');
            } else {
                $scope.count = response.count;
                $scope.documents = response.data;
                totalPages = Math.ceil(response.count / limit);
                currentPage = currentPage + 1;
            }
        }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load document data failure'));

        $scope.loadMoreDocs = function() {
            if ($scope.busy) {
                return;
            }

            $scope.busy = true;

            if(currentPage < totalPages) {
                rgiDocumentSrvc.query({skip: currentPage, limit: limit}, function (response) {
                    if(response.reason) {
                        rgiNotifier.error('Documents loading failure');
                    } else {
                        $scope.documents = _.union($scope.documents, response.data);
                        currentPage = currentPage + 1;
                        $scope.busy = false;
                    }
                }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Load document data failure'));
            }
        };

        $scope.deleteDocument = function(doc) {
            rgiDialogFactory.deleteDocument($scope, doc);
        };
    });

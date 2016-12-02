'use strict';

angular.module('app')
    .controller('rgiUnlinkDocumentDialogCtrl', ['$scope', 'rgiDocumentMethodSrvc', 'rgiNotifier', function (
        $scope,
        rgiDocumentMethodSrvc,
        rgiNotifier
    ) {
        var getDocumentIndex = function(currentDocument) {
            var documentIndex = -1;

            $scope.documents.forEach(function(doc, index) {
                if(doc._id === currentDocument._id) {
                    documentIndex = index;
                }
            });

            return documentIndex;
        };

        $scope.unlinkDocument = function() {
            $scope.document.answers = [];
            $scope.document.assessments = [];
            $scope.document.questions = [];

            rgiDocumentMethodSrvc.updateDocument($scope.document._id).then(function() {
                $scope.closeThisDialog();
                rgiNotifier.notify('The document has been deleted');
                $scope.documents[getDocumentIndex($scope.document)] = $scope.document;
            }, function(reason) {
                rgiNotifier.error(reason);
            });
        };
    }]);

'use strict';

angular.module('app')
    .controller('rgiDeleteDocumentDialogCtrl', ['$scope', 'rgiDocumentMethodSrvc', 'rgiNotifier', function (
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

        $scope.deleteDocument = function() {
            rgiDocumentMethodSrvc.deleteDocument($scope.document._id).then(function() {
                $scope.closeThisDialog();
                rgiNotifier.notify('The document has been deleted');
                $scope.documents.splice(getDocumentIndex($scope.document), 1);
            }, function(reason) {
                rgiNotifier.error(reason);
            });
        };
    }]);

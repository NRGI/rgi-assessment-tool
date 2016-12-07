'use strict';

angular.module('app')
    .controller('rgiUnlinkDocumentDialogCtrl', ['$scope', '$q', 'rgiDocumentMethodSrvc', 'rgiNotifier', function (
        $scope,
        $q,
        rgiDocumentMethodSrvc,
        rgiNotifier
    ) {
        var fields = ['answers', 'assessments', 'questions'];

        var getDocumentIndex = function(currentDocument) {
            var documentIndex = -1;

            $scope.documents.forEach(function(doc, index) {
                if(doc._id === currentDocument._id) {
                    documentIndex = index;
                }
            });

            return documentIndex;
        };

        var unlinkDocument = function(documentId) {
            fields.forEach(function(field) {
                $scope.document[field] = [];
            });
            return rgiDocumentMethodSrvc.updateDocument(documentId).$promise;
        };

        $scope.unlinkDocument = function() {
            var backup = {};
            var promises = [];

            fields.forEach(function(field) {
                backup[field] = $scope.document[field].slice();
            });

            promises.push(unlinkDocument($scope.document._id));

            $q.all(promises).then(function() {
                $scope.documents[getDocumentIndex($scope.document)] = $scope.document;
                $scope.closeThisDialog();
                rgiNotifier.notify('The document has been deleted');
            }, function(reason) {
                fields.forEach(function(field) {
                    $scope.document[field] = backup[field];
                });

                rgiNotifier.error(reason);
            });
        };
    }]);

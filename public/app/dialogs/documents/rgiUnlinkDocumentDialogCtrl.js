'use strict';

angular.module('app')
    .controller('rgiUnlinkDocumentDialogCtrl', ['$scope', '$q', 'rgiDocumentMethodSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiUnlinkDocumentSrvc', function (
        $scope,
        $q,
        rgiDocumentMethodSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiUnlinkDocumentSrvc
    ) {
        var fields = ['answers', 'assessments', 'questions'];

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
            promises.push(rgiUnlinkDocumentSrvc.delete({documentId: $scope.document._id}).$promise);

            $q.all(promises).then(function(res) {
                if(res.reason) {
                    fields.forEach(function(field) {
                        $scope.document[field] = backup[field];
                    });

                    rgiNotifier.error(res.reason);
                } else {
                    $scope.closeThisDialog();
                    rgiNotifier.notify('The document has been deleted');
                }
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler('Unlink document failure'));
        };
    }]);

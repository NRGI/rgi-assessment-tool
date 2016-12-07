'use strict';

angular.module('app')
    .controller('rgiUnlinkDocumentDialogCtrl', ['$scope', '$q', 'rgiDocumentSrvc', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiUnlinkDocumentSrvc', function (
        $scope,
        $q,
        rgiDocumentSrvc,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiUnlinkDocumentSrvc
    ) {
        var fields = ['answers', 'assessments', 'questions'];

        var unlinkDocument = function() {
            fields.forEach(function(field) {
                $scope.document[field] = [];
            });
            return new rgiDocumentSrvc($scope.document).$update();
        };

        $scope.unlinkDocument = function() {
            var backup = {};
            var promises = [];

            fields.forEach(function(field) {
                backup[field] = $scope.document[field].slice();
            });

            promises.push(unlinkDocument().$promise);
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

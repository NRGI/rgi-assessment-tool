'use strict';

angular.module('app').controller('rgiAnswerFormCtrl', function ($scope) {
    console.log($scope);
    $scope.redactorOptions = {
        keyupCallback: function (obj, event) {
            $scope.content = (obj.$el.getCode());
        }
    };
});
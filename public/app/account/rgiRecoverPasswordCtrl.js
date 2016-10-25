'use strict';

angular.module('app')
    .controller('rgiRecoverPasswordCtrl', ['$scope', '$location', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiResetPasswordSrvc', function (
        $scope,
        $location,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiResetPasswordSrvc
    ) {
        var getErrorMessage = function(errorCode) {
            return errorCode === 'USER_NOT_FOUND' ? 'The user is not found' : 'An unknown error occurred';
        };

        $scope.recoverPassword = function () {
            if ($scope.recoverPasswordForm.email.$pristine || $scope.recoverPasswordForm.email.$invalid) {
                return rgiNotifier.error('The email is incorrect');
            }

            rgiResetPasswordSrvc.recover($scope.email).then(function (response) {
                if(response.data.error) {
                    rgiNotifier.error(getErrorMessage(response.data.error));
                } else {
                    rgiNotifier.notify('An email with instructions to recover your password has been sent to your email address.');
                    $location.path('/');
                }
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler());
        };
    }]);

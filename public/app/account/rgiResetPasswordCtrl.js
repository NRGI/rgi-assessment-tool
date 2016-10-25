'use strict';

angular.module('app')
    .controller('rgiResetPasswordCtrl', ['$scope', '$routeParams', '$location', 'rgiHttpResponseProcessorSrvc', 'rgiNotifier', 'rgiResetPasswordSrvc', function (
        $scope,
        $routeParams,
        $location,
        rgiHttpResponseProcessorSrvc,
        rgiNotifier,
        rgiResetPasswordSrvc
    ) {
        var getErrorMessage = function(errorCode) {
            var errorMessages = {
                TOKEN_NOT_FOUND: 'The token is not found',
                USER_NOT_FOUND: 'The user is not found',
                SET_PASSWORD_ERROR: 'Unable to set password'
            };
            return errorMessages[errorCode] === undefined ? 'An unknown error occurred' : errorMessages[errorCode];
        };

        $scope.resetPassword = function () {
            if ($scope.password.length === 0) {
                return rgiNotifier.error('The password cannot be empty');
            } else if ($scope.password !== $scope.passwordRepeat) {
                return rgiNotifier.error('The passwords must match');
            }

            rgiResetPasswordSrvc.reset($routeParams.token, $scope.password).then(function (response) {
                if(response.data.error) {
                    rgiNotifier.error(getErrorMessage(response.data.error));
                } else {
                    rgiNotifier.notify('The password has been successfully reset. You can log in using your new password.');
                    $location.path('/');
                }
            }, rgiHttpResponseProcessorSrvc.getDefaultHandler());
        };
    }]);

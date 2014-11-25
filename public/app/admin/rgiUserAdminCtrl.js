angular.module('app').controller('rgiUserAdminCtrl', function($scope, rgiUser) {
  $scope.users = rgiUser.query();
});
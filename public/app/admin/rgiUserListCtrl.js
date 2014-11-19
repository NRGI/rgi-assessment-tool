angular.module('app').controller('rgiUserListCtrl', function($scope, rgiUser) {
  $scope.users = rgiUser.query();
});
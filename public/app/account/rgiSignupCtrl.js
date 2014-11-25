angular.module('app').controller('rgiSignupCtrl', function($scope, rgiUser, rgiNotifier, $location, rgiAuth) {

  $scope.signup = function() {
    var newUserData = {
      username: $scope.email,
      password: $scope.password,
      firstName: $scope.fname,
      lastName: $scope.lname
    };

    rgiAuth.createUser(newUserData).then(function() {
      rgiNotifier.notify('User account created!');
      $location.path('/');
    }, function(reason) {
      rgiNotifier.error(reason);
    })
  }
})
angular.module('app').controller('rgiCreateUserCtrl', function($scope, rgiUser, rgiNotifier, $location, rgiAuth) {

  $scope.createUser = function() {
    var newUserData = {
      firstName: $scope.fname,
      lastName: $scope.lname,
      username: $scope.username,
      email: $scope.email,
      password: $scope.password,
      roles: [$scope.roles],
      countries: [{
        country: $scope.country
      }],
      // // Need to create creation event
      // creation: {createdBy: user id, createdDate: Date.now},
      address: [$scope.address],
      language: [$scope.language]


    };

    rgiAuth.createUser(newUserData).then(function() {
      rgiNotifier.notify('User account created!');
      $location.path('/');
    }, function(reason) {
      rgiNotifier.error(reason);
    })
  }
})
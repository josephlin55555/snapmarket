angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope) {
  $scope.auth = function() {
    console.log('I am authenticating');
  };
})
.controller('ProfileCtrl', function($scope) {
  
});
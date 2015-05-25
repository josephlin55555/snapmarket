angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $state) {
  $scope.auth = function() {
    console.log('I am authenticating');
    $state.go('tab.profile');
  };
  console.log('ready');
})
.controller('ProfileCtrl', function($scope) {
  
});
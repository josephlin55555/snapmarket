angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $state, $rootScope) {

  $rootScope.ref = new Firebase("https://snapmarket.firebaseio.com");
  $rootScope.session = {};

  $scope.auth = function() {
    console.log('I am authenticating');

    $rootScope.ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $rootScope.session = authData;
        $state.go('tab.profile');
      }
    });
  }
})
.controller('ProfileCtrl', function($scope, $rootScope, $state) {

  if(!$rootScope.session) {
    $state.go('tab.login');
  }

  $scope.logout = function() {
    $rootScope.ref.unauth();
    $state.go('tab.login');
  };


});
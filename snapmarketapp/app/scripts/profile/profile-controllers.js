angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $state) {

  var ref = new Firebase("https://snapmarket.firebaseio.com");

  $scope.auth = function() {

    //asks user to login using facebook acct
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        //redirect to profile page
        $state.go('tab.profile');
      } //asks user for permission to grab facebook email
    }, {scope: "email"});
  }
})
.controller('ProfileCtrl', function($scope, $state) {

  var ref = new Firebase("https://snapmarket.firebaseio.com");

  //checks if current user is logged in; if not, redirects to login page
  if(!ref.getAuth()) {
    $state.go('tab.login');
  }

  $scope.logout = function() {
    //ends current user session
    ref.unauth(); 

    //moves to login page
    $state.go('tab.login'); 
  };


});
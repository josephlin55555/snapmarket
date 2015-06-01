angular.module('profile.controllers', ['firebase', 'profile.services'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, Db, Profile) {
  console.log('login controller instantiated!');

  if(Db.getAuth()) {
    $state.go('tab.profile', {}, { reload: true });
  } else {
  var users = $firebaseObject(Db.child("users"));
    //TODO: Move this into own factory called auth
    $scope.auth = function() {

      //asks user to login using facebook acct
      Db.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload");

          //waits until user has been fully loaded, then add user into firebase database
          users.$loaded().then(function() {
            // saves or updates user to database
            users[authData.uid] = Profile(authData);
            users.$save();
          });
          //redirect to profile page
          $state.go('tab.profile');
        } //asks user for permission to grab facebook email
      }, {scope: "email"});
    }
  }
})
.controller('ProfileCtrl', function($scope, $state, Db, Profile) {
  console.log('profile controller instantiated!');
  var authData = Db.getAuth();
  //checks if current user is logged in; if not, redirects to login page
  if(!Db.getAuth()) {
    $state.go('tab.login');
  } else {
    $scope.profile = Profile(authData)
  }

  $scope.logout = function() {
    //ends current user session
    Db.unauth(); 
    //moves to login page
    $state.go('tab.login'); 
  };

});
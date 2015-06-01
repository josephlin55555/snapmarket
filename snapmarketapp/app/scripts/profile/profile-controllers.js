angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, Db) {
  var users = $firebaseObject(Db.child("users"));

  //TODO: Move this into own factory called auth
  $scope.auth = function() {

    //asks user to login using facebook acct
    Db.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        //create an object for a user
        $rootScope.profile = {
          name: authData.facebook.displayName,
          email: authData.facebook.email,
          photo: authData.facebook.cachedUserProfile.picture.data.url,
          uid : authData.uid
        };
        //waits until user has been fully loaded, then add user into firebase database
        users.$loaded().then(function() {
          // saves or updates user to database
          users[authData.uid] = $rootScope.profile;
          users.$save();
        });
        //redirect to profile page
        $state.go('tab.profile');
      } //asks user for permission to grab facebook email
    }, {scope: "email"});
  }
})
.controller('ProfileCtrl', function($scope, $state, $rootScope, Db) {

  //checks if current user is logged in; if not, redirects to login page
  if(!Db.getAuth()) {
    $state.go('tab.login');
  }

  $scope.logout = function() {
    //ends current user session
    Db.unauth(); 
    $rootScope.profile = null;    //clear out user info on logout
    //moves to login page
    $state.go('tab.login'); 
  };

});
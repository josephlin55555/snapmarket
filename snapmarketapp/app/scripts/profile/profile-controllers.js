angular.module('profile.controllers', ['firebase', 'profile.services'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
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
          users[authData.uid] = Profile(authData);
          users.$save();
        });

        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        //redirect to profile page
        $state.go('tab.profile');
      } //asks user for permission to grab facebook email
    }, {scope: "email"});
  }
})
.controller('ProfileCtrl', function($scope, $state, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  var authData = Db.getAuth();
  $scope.profile = Profile(authData);

  $scope.logout = function() {
    //ends current user session
    Db.unauth();

    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });

    //moves to login page
    $state.go('tab.login'); 
  };

});
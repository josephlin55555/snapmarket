angular.module('profile.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject) {

  var ref = new Firebase("https://snapmarket.firebaseio.com");
  var users = $firebaseObject(ref.child("users"));

  $scope.auth = function() {

    //asks user to login using facebook acct
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);

        //waits until user has been fully loaded, then add user into firebase database
        users.$loaded().then(function() {

          //create an object for a user
          users[authData.uid] = {
            name: authData.facebook.displayName,
            email: authData.facebook.email,
            photo: authData.facebook.cachedUserProfile.picture.data.url,
          };

          // saves or updates user to database
          users.$save();

        });
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

  var currentUser = ref.getAuth();
  $scope.profileDisplayName = currentUser.facebook.displayName;
  $scope.profileEmail = currentUser.facebook.email;
  $scope.profileImage = currentUser.facebook.cachedUserProfile.picture.data.url;

  $scope.logout = function() {
    //ends current user session
    ref.unauth(); 

    //moves to login page
    $state.go('tab.login'); 
  };





});
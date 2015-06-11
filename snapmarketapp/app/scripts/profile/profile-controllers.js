angular.module('profile.controllers', ['firebase', 'profile.services', 'config'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  var users = $firebaseObject(Db.child("users"));
    //TODO: Move this into own factory called auth
  
  $rootScope.production = false;
  
  $scope.auth = function() {
    //asks user to login using facebook acct
    if($rootScope.production){
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
    }else{
      console.log('REDIRECTING FOR DEVELOPMENT');
      $state.go('tab.profile');
    }
  }

})
.controller('ProfileCtrl', function($scope, $rootScope ,$state, $ionicHistory, Db, Profile , ENV) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  $rootScope.TESTUSER= JSON.parse('{"uid":"facebook:10205252634008521","provider":"facebook","facebook":{"id":"10205252634008521","accessToken":"CAAHsTNfTaFsBAPXVGZCVHcZBvy74eLpdFYiJH95Eu2kynfVwPy0V0N4YWqoyzwIcN7UBuHLQ5zUsz2UuZCZAlgon0k2VM8nfSSr0dTbWFWSZBc6uf0sOsIQQGfZCdQ4q8E36jb40kisSOg0ZBlCFRFYsFb8MdudZAFsAApfeBli2QNk8p0f0tuiHJ5msFH2RAZAc1L4ZBwqSOr7VdevlDxTNFoZAHtVi51zQFIZD","displayName":"Dave Grundfest","email":"dave4@grundfest.com","cachedUserProfile":{"id":"10205252634008521","name":"Dave Grundfest","last_name":"Grundfest","first_name":"Dave","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10205252634008521/","email":"dave4@grundfest.com","picture":{"data":{"is_silhouette":false,"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/p100x100/110…9dc7f4f41c&oe=55FEF874&__gda__=1442528524_cd49d3549e5526900d3dcde43cf941e7"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMjA1MjUyNjM0MDA4NTIxIiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzM4MDc4NDh9.MMHKH0HlSnvUpIVlBQGdWiR_6Hge1KwnsYvT_z9MwjY","auth":{"uid":"facebook:10205252634008521","provider":"facebook"},"expires":1433894248}');

  if($rootScope.production) console.log(JSON.stringify(Db.getAuth()));

  var authData = $rootScope.production ? Db.getAuth() : $rootScope.TESTUSER;

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
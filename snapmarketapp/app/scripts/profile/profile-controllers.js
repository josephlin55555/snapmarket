angular.module('profile.controllers', ['firebase', 'profile.services', 'config'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  var users = $firebaseObject(Db.child("users"));
  
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
.controller('ProfileCtrl', function($scope, $rootScope ,$state, $ionicHistory, Db, Profile , ENV, $firebaseArray, $ionicLoading) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  //displays during async data retrieval
  $ionicLoading.show({
    template: "Loading..."
  });

  var authData = $rootScope.production ? Db.getAuth() : $rootScope.TESTUSER;

  $scope.profile = Profile(authData);

  /*
    used for amount of listings and offers
  */

  //active
  $scope.activeUserListings = [];
  $scope.activeUserBuyOffers = [];
  $scope.activeUserSellOffers = [];

  //inactive
  $scope.inactiveUserListings = [];
  $scope.inactiveUserBuyOffers = [];
  $scope.inactiveUserSellOffers = [];

  //completed
  $scope.completedUserListings = [];
  $scope.completedUserBuyOffers = [];
  $scope.completedUserSellOffers = [];

  var offers = $firebaseArray(Db.child('offers'));
  offers.$loaded().then(function() {

    var listings = $firebaseArray(Db.child('listings'));
    listings.$loaded().then(function() {

      //used to display listings
      for(var i = 0; i < listings.length; i++) {
        if($scope.profile.uid === listings[i].user) {
          if(listings[i].status === "active") {
            $scope.activeUserListings.push(listings[i]);
          }

          if(listings[i].status === "inactive") {
            $scope.inactiveUserListings.push(listings[i]);
          }

          if(listings[i].status === "completed") {
            $scope.completedUserListings.push(listings[i]);
          }
        }
      }

      for(var i = 0; i < offers.length; i++) {
        //offers given to you
        if(offers[i].$id !== "keyGen") {
          if(offers[i].seller === $scope.profile.uid) {
            if(offers[i].status === "active") {
              $scope.activeUserSellOffers.push(offers[i]);
            }

            if(offers[i].status === "inactive") {
              $scope.inactiveUserSellOffers.push(offers[i]);
            }

            if(offers[i].status === "completed") {
              $scope.completedUserSellOffers.push(offers[i]);
            }
          }

          //offers you gave to others
          if(offers[i].buyer.uid === $scope.profile.uid) {
            if(offers[i].status === "active") {
              $scope.activeUserBuyOffers.push(offers[i]);
            }

            if(offers[i].status === "inactive") {
              $scope.inactiveUserBuyOffers.push(offers[i]);
            }

            if(offers[i].status === "completed") {
              $scope.completedUserBuyOffers.push(offers[i]);
            }
          }
          
        }
      }
      //closes once async retrieval is complete
      $ionicLoading.hide();
    });
  });


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
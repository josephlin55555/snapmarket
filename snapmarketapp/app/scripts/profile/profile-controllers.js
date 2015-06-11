angular.module('profile.controllers', ['firebase', 'profile.services', 'config'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  var users = $firebaseObject(Db.child("users"));

  //for demo to circumvent auth, change $rootScope.production to false
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
.controller('ProfileCtrl', function($scope, $rootScope ,$state, $ionicHistory, Db, Profile , ENV, $firebaseArray, $ionicLoading) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  $rootScope.TESTUSER = JSON.parse('{"uid":"facebook:10103190689439614","provider":"facebook","facebook":{"id":"10103190689439614","accessToken":"CAAHsTNfTaFsBAAaybKLqgMshdBTGJUu8cIzwITPGLBWi1mXXBHfT9bYocwphBGXhwhp7BGqdxR7rV0Bu6pMZBP2fnFGWDFdIcEMbTa0QxTfgmgwdvfZCf2RVK0C7d86SAXlxHQU4ojSCTY3cBj2Qzz9ZCdjBmUyt54nZBu5mMenhmZACEg1qCTfrp205yI1R2ckhRutWzDcy796UkZAuHW","displayName":"Andy Tran","email":"imagez@gmail.com","cachedUserProfile":{"id":"10103190689439614","name":"Andy Tran","last_name":"Tran","first_name":"Andy","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10103190689439614/","email":"imagez@gmail.com","picture":{"data":{"is_silhouette":false,"url":"http://i.imgur.com/i7Ixwed.jpg"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMTAzMTkwNjg5NDM5NjE0IiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzM5OTA2Njd9.hslTJCx61ooRdiPHtyF5WPlduj7vWFsGQavtRHkDDL0","auth":{"uid":"facebook:10103190689439614","provider":"facebook"},"expires":1434077067}');

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

    var listings = $firebaseArray(Db.child('listings2'));
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
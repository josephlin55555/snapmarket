angular.module('profile.controllers', ['firebase', 'profile.services', 'config'])
.controller('LoginCtrl', function($scope, $state, $firebaseObject, $rootScope, $ionicHistory, Db, Profile) {
  $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  var users = $firebaseObject(Db.child("users"));
    //TODO: Move this into own factory called auth
  
  $rootScope.production = true;
  
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


  $rootScope.TESTUSER= JSON.parse('{"uid":"facebook:10204542119488571","provider":"facebook","facebook":{"id":"10204542119488571","accessToken":"CAAHsTNfTaFsBAFCbDEADoqxwrU29NwCfQoFpvA0lnPLkMceuDDmQoBzAk7LuaZAWQ32o6ZBgvdF98BZACLFNq7BSIvr3fnuMlq5eDy3rLtHrhanlP4jprimQkGsSGRZByZCnSOOQDZCZBF6584Hf6zqq1JFAvn9qj2Lb6Dg2ZBahiPdYE2r6AEV1XFIzSNhCbLyD48XQMAfXcDuXgrAZBrM84","displayName":"Vivek Tumrukota","email":"vtumrukota@gmail.com","cachedUserProfile":{"id":"10204542119488571","name":"Vivek Tumrukota","last_name":"Tumrukota","first_name":"Vivek","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10204542119488571/","email":"vtumrukota@gmail.com","picture":{"data":{"is_silhouette":false,"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/109…2cf1841106&oe=55F431B2&__gda__=1441461351_782986e2ae99c1d2d30b38d21dac6229"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMjA0NTQyMTE5NDg4NTcxIiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzM5OTE0MDN9.sv4l_fxnNu52V3XKb-AL5t_4SuNrNkOcU-eUkXJ0gtE","auth":{"uid":"facebook:10204542119488571","provider":"facebook"},"expires":1434077803}');

  //displays during async data retrieval
  $ionicLoading.show({
    template: "Loading..."
  });

  if($rootScope.production) console.log(JSON.stringify(Db.getAuth()));

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
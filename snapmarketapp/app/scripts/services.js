'use strict';

angular.module('starter.services', [
  'buy.services', 
  'sell.services',
  'transaction.services', 
  'profile.services'])

 .factory('Db',  function($window) {
    return new $window.Firebase('https://snapmarket.firebaseio.com');
 })
 .run(function($rootScope, $state, $ionicTabsDelegate, Db, Camera, $firebaseObject){
  //for demo to circumvent auth, change $rootScope.production to false
  $rootScope.production = true;
  $rootScope.TESTUSER = JSON.parse('{"uid":"facebook:10204542119488571","provider":"facebook","facebook":{"id":"10204542119488571","accessToken":"CAAHsTNfTaFsBAPxxsY9SVQrIY4pbgppVjZAmGmO22nkyYRvDZAzQXIOTjd0ODsaUcKZBC5jTLZCk8gRHZCVXdsFqMHKeOMtXcpLlqXoURydNQ1CpZBxZA4eRzonCIwriTsNeRIWzjZBbsxFvXWrbscjRgL3XVZA37RyF5m2nbBuisUVsDiUgro1ChFNXaZCriufZCGraiIzXJrqR6LZBtx9KqYg0","displayName":"Vivek Tumrukota","email":"vtumrukota@gmail.com","cachedUserProfile":{"id":"10204542119488571","name":"Vivek Tumrukota","last_name":"Tumrukota","first_name":"Vivek","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10204542119488571/","email":"vtumrukota@gmail.com","picture":{"data":{"is_silhouette":false,"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/109…2cf1841106&oe=55F431B2&__gda__=1441461351_782986e2ae99c1d2d30b38d21dac6229"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMjA0NTQyMTE5NDg4NTcxIiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzQwNjAwNDJ9.n7GLG9y_EHnzPj0ubVngfSOVELG8MVo-uT_4Nw8tpdc","auth":{"uid":"facebook:10204542119488571","provider":"facebook"},"expires":1434146442}');
  
  //check for authentication prior to state change
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
    if(!$rootScope.production){
      shouldLogin = false;
    }else{
      var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !Db.getAuth();
    }

    if(shouldLogin){
      console.log('redirect to LOGIN!')
      $ionicTabsDelegate.select(3);
      $state.go('tab.login');
      event.preventDefault();
      return;
    } 

    if(toState.url === '/sellCamera'){
      if(!$rootScope.lastPhoto){
        var options = { 
            quality : 10, 
            destinationType : 0, 
            sourceType : 1, 
            allowEdit : true,
            encodingType: 0,
            targetWidth: 750,
            targetHeight: 1000,
            saveToPhotoAlbum: false
        };
          //for development if the camera does not exists redirect to a static image
        if(!Camera.cameraExists()){
          var db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/listings/-Jrc_vJUUoCVtFDmoiS2"))
          db.$loaded().then(
            function(data){
              $rootScope.lastPhoto=data.img;
            });
        } else{
          Camera.getPicture(options).then(function(imageURI) {
            $rootScope.lastPhoto="data:image/jpeg;base64," + imageURI;
          }, function(err) {
            console.err(err);
            });
        }
      }
    }

  })
});
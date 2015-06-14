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
  $rootScope.production = false;
  $rootScope.TESTUSER = JSON.parse('{"uid":"facebook:10103190689439614","provider":"facebook","facebook":{"id":"10103190689439614","accessToken":"CAAHsTNfTaFsBANjT5ZAQvre07xT7Xopm15gVmy99mRdVvWO8BYQHhJyqw4Tt2cFqnLqnbsfRzuvPzcYG38r0E4xvCSEAOy6LuOs6UYUszUMo08U5IgWvP5OiYtn1qeIRNkBlFIVQHSN3kkZA4H6MYrbadik6tgcSejOyY48w6ExIxZAQWp2eqZCG3SoakqzLgXlkZBWyOZA9ZA0dcmqOwkg","displayName":"Andy Tran","email":"imagez@gmail.com","cachedUserProfile":{"id":"10103190689439614","name":"Andy Tran","last_name":"Tran","first_name":"Andy","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10103190689439614/","email":"imagez@gmail.com","picture":{"data":{"is_silhouette":false,"url":"http://i.imgur.com/NLMwJZD.jpg"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMTAzMTkwNjg5NDM5NjE0IiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzQyMzE3NzR9.VxpzWp8wTg9dKSI6VtfdDlaXAVk8-Rq-9hTTNGr2GXE","auth":{"uid":"facebook:10103190689439614","provider":"facebook"},"expires":1434318174}');
  
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
          var db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/listings/-Jr_9FO-UNf_0Mt0gFm0"))
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
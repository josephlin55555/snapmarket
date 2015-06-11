'use strict';

angular.module('starter.services', [
  'buy.services', 
  'sell.services',
  'transaction.services', 
  'profile.services'])

 .factory('Db',  function($window) {
    return new $window.Firebase('https://snapmarket.firebaseio.com');
 })
 .run(function($rootScope, $state, $ionicTabsDelegate, Db){
  //for demo to circumvent auth, change $rootScope.production to false
  $rootScope.production = false;
  $rootScope.TESTUSER = JSON.parse('{"uid":"facebook:10103190689439614","provider":"facebook","facebook":{"id":"10103190689439614","accessToken":"CAAHsTNfTaFsBAAaybKLqgMshdBTGJUu8cIzwITPGLBWi1mXXBHfT9bYocwphBGXhwhp7BGqdxR7rV0Bu6pMZBP2fnFGWDFdIcEMbTa0QxTfgmgwdvfZCf2RVK0C7d86SAXlxHQU4ojSCTY3cBj2Qzz9ZCdjBmUyt54nZBu5mMenhmZACEg1qCTfrp205yI1R2ckhRutWzDcy796UkZAuHW","displayName":"Andy Tran","email":"imagez@gmail.com","cachedUserProfile":{"id":"10103190689439614","name":"Andy Tran","last_name":"Tran","first_name":"Andy","gender":"male","link":"https://www.facebook.com/app_scoped_user_id/10103190689439614/","email":"imagez@gmail.com","picture":{"data":{"is_silhouette":false,"url":"http://i.imgur.com/i7Ixwed.jpg"}},"age_range":{"min":21},"locale":"en_US","timezone":-7}},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMTAzMTkwNjg5NDM5NjE0IiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MzM5OTA2Njd9.hslTJCx61ooRdiPHtyF5WPlduj7vWFsGQavtRHkDDL0","auth":{"uid":"facebook:10103190689439614","provider":"facebook"},"expires":1434077067}');
  
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
  })
});
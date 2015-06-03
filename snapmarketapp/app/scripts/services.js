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
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
    var shouldLogin = toState.data !== undefined && toState.data.requireLogin && !Db.getAuth();

    //for development purposes - MUST BE DELETED ONCE AUTH IS FIXED!!!
    var shouldLogin = false;

    if(shouldLogin){
      console.log('redirect to LOGIN!')
      $ionicTabsDelegate.select(3);
      $state.go('tab.login');
      event.preventDefault();
      return;
    } 
    // else if(redirectToProfile){
    //   console.log('redirect to PROFILE!')
    //   $ionicTabsDelegate.select(3);
    //   $state.go('tab.profile');
    //   event.preventDefault();
    //   return;
    // }
  })
});
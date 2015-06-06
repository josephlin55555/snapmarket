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

    //only for demo
    //shouldLogin = false;

    if(shouldLogin){
      console.log('redirect to LOGIN!')
      $ionicTabsDelegate.select(3);
      $state.go('tab.login');
      event.preventDefault();
      return;
    } 
  })
});
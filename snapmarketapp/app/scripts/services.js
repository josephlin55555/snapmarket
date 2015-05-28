'use strict';

angular.module('starter.services', [
  'buy.services', 
  'sell.services', 
  'profile.services'])

 .factory('Db',  function($window) {
    return new $window.Firebase('https://snapmarket.firebaseio.com');
 });
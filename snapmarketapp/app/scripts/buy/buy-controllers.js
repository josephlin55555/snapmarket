angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($rootScope, $scope, $firebaseObject) {
  
  // download the data into a local object
  $rootScope.db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/"));

  // once loaded, perform callback
  $rootScope.db.$loaded()
    .then(function() {
      console.log('finished loading firebase:', $rootScope.db.users);
    })
    .catch(function(err) {
      console.error(err);
  });
})
.controller('BuyItemDetailCtrl', function($scope) {})
.controller('BuyItemOfferCtrl', function($scope) {})
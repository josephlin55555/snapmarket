angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($scope, $firebaseObject) {
  
  // download the data into a local object
  var ref = new Firebase("https://snapmarket.firebaseio.com/listings");
  var listings = $firebaseObject(ref);
  $scope.items = [];

  // once loaded, perform callback
  listings.$loaded()
    .then(function() {
      //generate all listings

    })
    .catch(function(err) {
      console.error(err);
  });
})
.controller('BuyItemDetailCtrl', function($scope) {})
.controller('BuyItemOfferCtrl', function($scope) {})
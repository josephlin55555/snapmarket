angular.module('transaction.controllers', ['firebase'])
.controller('TransactionCtrl', function($scope) {

  // download the data into a local object
  $scope.db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/"));

  // once loaded, perform callback
  $scope.db.$loaded()
    .then(function() {
      console.log('finished loading firebase:', $scope.db.users);
    })
    .catch(function(err) {
      console.error(err);
  });
})
.controller('BuyOfferCtrl', function($scope) {})
.controller('BuyTransactionChatCtrl', function($scope) {})
.controller('SellListingsCtrl', function($scope) {})
.controller('SellListingItemsCtrl', function($scope) {})
.controller('SellItemOffersCtrl', function($scope) {})
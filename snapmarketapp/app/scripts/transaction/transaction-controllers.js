angular.module('transaction.controllers', [])
.controller('TransactionCtrl', function($scope) {

 
})
.controller('BuyOfferCtrl', function($scope) {})
.controller('BuyTransactionChatCtrl', function($scope) {})

.controller('SellListingsCtrl', function($scope, $state, Db) {
  console.log(Db);
//
  $scope.sellView = function(){
    $state.go('tab.sellListings');
    console.log('hits');
  }
  $scope.buyView = function(){
    $state.go('tab.buyOffers');
    console.log('hits');
  }

})

.controller('SellListingItemsCtrl', function($scope) {})
.controller('SellItemOffersCtrl', function($scope) {})
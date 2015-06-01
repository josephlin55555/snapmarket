angular.module('transaction.controllers', [])
.controller('TransactionCtrl', function($rootScope, $scope, $state, Db) {
  //default to buy view once transaction tab is pressed
  $state.go('tab.transaction.buyOffers'); 

})

//Buy Navigation controllers
.controller('BuyOfferCtrl', function($rootScope, $scope, $state, Db) {
  $scope.dummy = [1,3,4,5,2,8];
  //array of the particular user's buyOffer listing objects
  $scope.allOffers = [];
  //array of listingId's (of the offers) in user's firebase object
  $scope.listingIds = [];
})
.controller('BuyTransactionChatCtrl', function($scope) {})
.controller('SellListingsCtrl', function($scope, $state, Db) {})
.controller('SellListingItemsCtrl', function($scope) {})
.controller('SellItemOffersCtrl', function($scope) {})
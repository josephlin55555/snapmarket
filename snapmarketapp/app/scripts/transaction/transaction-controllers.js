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
.controller('BuyTransactionChatCtrl', function($scope, Db) {})
  //var buyOffer = Db.child('Users')


//////////////////Sell Navigation controllers
.controller('SellListingsCtrl', function($scope, $state, Db) {
  $scope.dummy = ['YO ITS COOL', 'FIRE STUFF', 'MAD SHIZZ'];

  $scope.viewList = function(){
    console.log('shift states');
    $state.go('tab.sellListingItems');
   }

})
.controller('SellListingItemsCtrl', function($scope, $state) {
  $scope.dummy = ['YO ITS COOL', 'FIRE STUFF', 'MAD SHIZZ'];

})
.controller('SellItemOffersCtrl', function($scope, $state) {})



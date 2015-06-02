angular.module('transaction.controllers', [])
.controller('TransactionCtrl', function($rootScope, $scope, $state, Db) {
  //default to buy view once transaction tab is pressed
  $state.go('tab.transaction.buyOffers'); 
})

//Buy Navigation controllers
.controller('BuyOfferCtrl', function($rootScope, $scope, $state, $firebaseObject, Db) {
  $scope.dummy = [1,3,4,5,2,8];
 
  $scope.view = function(){
    $state.go('tab.buy-transactionChat');
  }

  var buyOffers = Db.child('Users')

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
.controller('SellListingItemsCtrl', function($scope, $state, Db) {
  $scope.dummy = ['LISTING 1', 'LISTING 2', 'LISTING 3'];

  $scope.viewItem = function(){
    console.log('CHANGING OUR STATE');
    $state.go('tab.sellListingItems.sellItemOffers');

  }
})
.controller('SellItemOffersCtrl', function($scope, $state, Db) {
  console.log('sellitemoffers is trying to load');
})



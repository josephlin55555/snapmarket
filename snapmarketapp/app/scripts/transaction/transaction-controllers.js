angular.module('transaction.controllers', [])

//Buy Navigation controllers
.controller('BuyOfferCtrl', function($rootScope, $scope, $state, $firebaseObject, Db) {
  $rootScope.nav = {
    bar : false
  };
  var buyOffers = Db.child('Users')
  $scope.dummy = [1,3,4,5,2,8];
 
  $scope.view = function(){
    $state.go('tab.transaction.transactionChat');
  }

})
.controller('BuyTransactionChatCtrl', function($rootScope, $scope, $state, Db) {
  $rootScope.nav = {
    bar : true,
    title: "Buyer: Item Chat",
    url: "#/tab/transaction/buyOffers"
  };
  console.log('buy transaction chat initiated')
})
  

//Sell Navigation controllers
.controller('SellListingsCtrl', function($rootScope, $scope, $state, Db) {
  $rootScope.nav = {
    bar : false,
    title : "Seller: Listings"
  };
  $scope.dummy = ['YO ITS COOL', 'FIRE STUFF', 'MAD SHIZZ'];

  $scope.viewList = function(){
    $state.go('tab.transaction.sellListingItems');
   }

  var currentUser = Db.getAuth().uid;
  var listingArray = [];  
  var listingObj = $firebaseObject(Db);
  //When Db loads, filter through and find all listings from that user
  listingObj.$loaded().then(function(){ 
    angular.forEach(listingObj.listings2, function(value, key) {
      if(listingObj.listings2[key]['user'].toString() === currentUser.toString()){
        console.log('hit array!'); 
        listingArray.push(listingObj.listings2[key]);
      }
    });    
    console.log(listingArray)

  });
  
})

.controller('SellListingItemsCtrl', function($rootScope, $scope, $state, Db) {
  $rootScope.nav = {
    bar : true,
    title: "Seller: Items",
    url: "#/tab/transaction/sellListings"
  };
  $scope.dummy = ['LISTING 1', 'LISTING 2', 'LISTING 3'];

  $scope.viewItem = function(){
    $state.go('tab.transaction.sellItemOffers');

  }
})
.controller('SellItemOffersCtrl', function($rootScope, $scope, $state, Db) {
  $rootScope.nav = {
    bar : true,
    title: "Seller: Item Chat",
    url: "#/tab/transaction/sellListingItems"
  };
  console.log('sellitemoffers is trying to load');
})



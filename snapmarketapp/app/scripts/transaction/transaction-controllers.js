angular.module('transaction.controllers', [])
.controller('TransactionCtrl', function($rootScope, $scope, $state, Db) {
  //default to Buy view once transaction tab is pressed
  console.log('Loaded Transaction');

  //!!! only working on first pass, next times arent redirecting

  var user = $rootScope.profile;
   if(user === null|| user === undefined) {
    console.log('redirecting to login');
    $state.go("tab.login");   //take you to login page
  } else {
    $state.go('tab.transaction.buyOffers'); //if logged in default to buyOffers
  }

})

//////////////////Buy Navigation controllers
.controller('BuyOfferCtrl', function($rootScope, $scope, $state, Db) {
  $scope.dummy = [1,3,4,5,2,8];
  //array of the particular user's buyOffer listing objects
  $scope.allOffers = [];
  //array of listingId's (of the offers) in user's firebase object
  $scope.listingIds = [];
  //Make sure the user is logged-in
     //will return null if not logged in
  var userId = $rootScope.profile;
   console.log(userId);

 // var users = Db.Users.lis;
})
.controller('BuyTransactionChatCtrl', function($scope) {})
.controller('SellListingsCtrl', function($scope, $state, Db) {})
.controller('SellListingItemsCtrl', function($scope) {})
.controller('SellItemOffersCtrl', function($scope) {})
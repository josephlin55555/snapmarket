angular.module('transaction.controllers', [])

  //Buy Navigation controllers
  .controller('BuyOfferCtrl', function($rootScope, $scope, $state, $firebaseObject, Db) {
    $rootScope.nav = {
      bar : false
    };
    var buyOffers = Db.child('Users')
    $scope.dummy = [1,3,4,5,2,8];
   
    $scope.view = function(){
      $state.go('tab.transaction.chat');
    }

  })
  .controller('TransactionChatCtrl', function($rootScope, $scope, $state, Db) {
    $rootScope.nav = {
      bar : true,
      title: "Current Offer",
      url: "#/tab/transaction/buyOffers"
    };
  })
    

  //Sell Navigation controllers
  .controller('SellListingsCtrl', function($rootScope, $scope, $state, $firebaseObject, Db, $ionicLoading) {
    $rootScope.nav = {
      bar : false,
      title : "Seller: Listings"
    };

    $scope.viewList = function(value){
      $state.go('tab.transaction.sellOffers');
      $rootScope.listing = value;
     }
    //Loading indicator while Db is being loaded
    $ionicLoading.show({
        template: 'Loading...'
      });

    //Create array of current user's listings
    var currentUser = Db.getAuth().uid;
    var listingArray = [];  
    var listingObj = $firebaseObject(Db.child('listings2'));
    //When Db loads, filter through and find all listings from that user
    listingObj.$loaded().then(function(){ 
      angular.forEach(listingObj, function(value, key) {
        if(listingObj[key]['user'].toString() === currentUser.toString()){
          listingArray.push(listingObj[key]);
        }
      });
      $rootScope.myListings = listingArray;
      $ionicLoading.hide();    
    });
  })

  .controller('SellOffersCtrl', function($rootScope, $scope, $state, Db) {
    $rootScope.nav = {
      bar : true,
      title: "Seller: Offers",
      url: "#/tab/transaction/sellListings"
    };

    $scope.items = $rootScope.listing.items;

    $scope.viewItem = function(value){
      $state.go('tab.transaction.chat');
      $rootScope.item = value;
    }
  });








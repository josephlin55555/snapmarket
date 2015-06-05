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

    //Grab facebookId of current user
    $rootScope.currentUser = Db.getAuth().uid; 
    //Grab object of all listings in the Db
    var listings = $firebaseObject(Db.child('listings2'));
    //create filtered object of current users listings
    $rootScope.userListings = {};
    //When Db loads, filter through and find all listings from that user
    listings.$loaded().then(function(){ 
      angular.forEach(listings, function(value, key) {
        //check if user facebookId matches listingId user
        if(listings[key]['user'].toString() === $rootScope.currentUser.toString()){
          $rootScope.userListings[key] = listings[key];
        } 
      });
      //Hide loading screen when array is filled
      console.log($rootScope.userListings);
      $ionicLoading.hide();    
    });
  })

  .controller('SellOffersCtrl', function($rootScope, $scope, $state, Db, $firebaseObject) {
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

    var allOffers = $firebaseObject(Db.child('offers'));

    console.log($rootScope.listing);

    allOffers.$loaded().then(function(){
      angular.forEach(allOffers, function(value, key) {
      
      })  
    })



  });








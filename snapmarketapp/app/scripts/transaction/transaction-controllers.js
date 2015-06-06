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
      $rootScope.currentlisting = value;
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
      $ionicLoading.hide();    
    });
  })

  .controller('SellOffersCtrl', function($rootScope, $scope, $state, Db, $firebaseObject) {
    $rootScope.nav = {
      bar : true,
      title: "Seller: Offers",
      url: "#/tab/transaction/sellListings"
    };

    $scope.viewItem = function(value){
      $state.go('tab.transaction.chat');
      $rootScope.item = value;
    }

    //create array of offers
    var offerIds = $rootScope.currentlisting.offers;    
    console.log(offerIds); 

    var user = $firebaseObject(Db.child('users'));
    var offers = $firebaseObject(Db.child('offers'));

    $scope.listingOffers = [];   //array to hold all offer objects
    
    offers.$loaded().then(function(){
      for(var i=0; i < offerIds.length; i++) {
        $scope.listingOffers.push(offers[offerIds[i]]);
      }
      console.log($scope.listingOffers);      
    });
  });








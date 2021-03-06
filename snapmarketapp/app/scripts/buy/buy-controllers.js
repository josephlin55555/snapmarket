angular.module('buy.controllers', ['firebase'])

.controller('BuySearchCtrl', function($scope, $firebaseObject, $firebaseArray, $state, $rootScope, Db, $ionicLoading, RenderTags) {
  /*
  once buySearch view is loaded, check if keyGen variable exists and load if necessary
  keyGen is needed to keep track of offers (also tracked in user.buy)
  */
  var offers = $firebaseObject(Db.child('offers'));
  offers.$loaded().then(function() {
    if(offers.keyGen === undefined) {
      offers.keyGen = 0;
      offers.$save();
    }
  });

  // alternative array type for firebase listings
    //TODO: convert to Ref

  var ref = new Firebase("https://snapmarket.firebaseio.com/listings");
  $scope.listings = $firebaseArray(ref);
  $scope.results = [];

  // filter listings/results to display
  var filterListings = function(array, tag){
    var res = [];
    for(var i = 0; i < array.length; i++){
      var listing = array[i];
      if(tag === undefined || listing.allTags.indexOf(tag) > -1){
        res.push(array[i]);
      }
    }
    return res;
  }

  var syncCards = function(){
    console.log('SYNCING CARDS');
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.results = filterListings($scope.listings);
    for(var i = 0; i < $scope.results.length; i++) {
      $scope.results[i].moment = moment($scope.results[i].createdAt).fromNow();
      $scope.results[i].order = moment($scope.results[i].createdAt).valueOf();
      console.log("result:", moment($scope.results[i].createdAt).valueOf());
    }
    $ionicLoading.hide();
  };

  // copy over full listings to the results array for display
  $scope.listings.$loaded()
    .then(function(){
      syncCards();
      $scope.listings.$watch(function(){
        syncCards();
      });
  });


  //filter scope.results through one tag
  $scope.filterOne = function(tag){
    $scope.results = filterListings($scope.results, tag);
  }

  $scope.selectCard = function(card) {
    //card argument is listing object
    $rootScope.currentListing = card;
    
    //$id is the unique hash id for each item in the firebase array
    $state.go('tab.buyListingDetail', {'listingId': card.$id});
  };

    //recompute scope.results
  $scope.filterAll = function(tagRemoved, tagCloud){
    $scope.results = filterListings($scope.listings);
    for(var i = 0; i < tagCloud.length; i++){
      var tag = tagCloud[i];
      $scope.results = filterListings($scope.results, tag);
    }
  }

  // download tags into a local object for search
  var tags = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/tags"));
  $scope.tags = [];
  
  $scope.position = function(item){
    return RenderTags(item,{x:0,y:0,sX:400,sY:400},{x:-72,y:-82});
  };

  $scope.positionText = function(item){
    return RenderTags(item,{x:0,y:0,sX:400,sY:400},{x:-61,y:-61},{transform: 'rotate(-20deg) scale(.8,.8)', color:'#fff'});  
  };

  // once tags have been loaded, place each tag and no. of listings into an array called $scope.tags
  tags.$loaded()
    .then(function(){
      angular.forEach(tags, function(value, key){
        if(!angular.isFunction(value)){
          $scope.tags.push([key,value]);
        }
      });
    })
    .catch(function(err) {
      console.error(err);
  });


})

.controller('BuyListingDetailCtrl', function($scope, $rootScope, $state, Db, $firebaseObject, $firebaseArray, Profile, RenderTags, DisplayTags) {

  if($rootScope.currentListing === undefined) {
    $state.go('tab.buySearch');
  }

  $scope.position = function(item){
    return RenderTags(item,{x:20,y:20,sX:363,sY:363},{x:-72,y:-82});
  };

  $scope.positionText = function(item){
    return RenderTags(item,{x:20,y:20,sX:363,sY:363},{x:-61,y:-61},{transform: 'rotate(-20deg) scale(.8,.8)', color:'#fff'});  
  };


  //changes based on what items the buyer toggles in ion-checkbox
  $scope.totalSellerPrice = 0;
  $scope.selectedItems = [];
  $scope.formatTags = DisplayTags;
  //activates once ion-checkbox is selected
  $scope.check = function(checked, item) {
    if(checked === true) {
      $scope.totalSellerPrice += Number(item.price);

      var exists = false;
      $scope.selectedItems.forEach(function(val) {
        if(val.id === item.id) {
          exists = true;
        }
      });

      if(exists === false) {
        $scope.selectedItems.push(item);
      }

    } else {
      $scope.totalSellerPrice -= Number(item.price);

      for(var i = 0; i < $scope.selectedItems.length; i++) {
        if($scope.selectedItems[i]) {
          if($scope.selectedItems[i].id === item.id) {
            delete $scope.selectedItems[i];
          }
        }
      }
    }

    //delete later
    console.log("total amount: $" + $scope.totalSellerPrice);
    console.log("selected items: ", $scope.selectedItems);
  };

  $scope.submitPrice = function(price) {

    var userAuth = $rootScope.production ? Db.getAuth() : $rootScope.TESTUSER;
    console.log('userAuth ', userAuth)
    //if user is not logged in redirect to login
    if(!userAuth){
      $state.go(tab.login);
    }
    
    //clear input fields
    $('.buyerPrice').val('');

    //load up offers object
    var offers = $firebaseObject(Db.child('offers'));
    offers.$loaded().then(function() {

      //adds the keyGen uniqueID under users
      var users = $firebaseObject(Db.child('users'));
      users.$loaded().then(function() {

        var userData = null;
        for(var key in users) {
          if(key === $rootScope.currentListing.user) {
            userData = users[key];
          }
        }
        

        //create an offer object with relevant information
        var offer = {
          buyer: Profile(userAuth),
          seller: userData,
          listing: $rootScope.currentListing.$id,
          listingTitle: $rootScope.currentListing.title,
          img: $rootScope.currentListing.img,
          messages: [],
          totalBuyerPrice: price,
          totalSellerPrice: $scope.totalSellerPrice,
          items: $scope.selectedItems,
          uniqueId: offers.keyGen, 
          status: "active",
          createdAt: new Date().toString()
        };

        //sets the offer object
        offers[offers.keyGen] = offer;

        //be careful with forEach
        users.forEach(function(user) {
          if(user.uid === userAuth.uid) {
            if(user.buy === undefined) {
              user.buy = [offers.keyGen];
            } else {
              user.buy.push(offers.keyGen);
            }
          }
        });

        //can only $save with $firebaseObject ($firebaseArray uses $add and doesn't use $save)
        var listings = $firebaseObject(Db.child('listings'));
        listings.$loaded().then(function() {
          //in order to access unique Hash ID, use for-in loop (e.g. "key")
          for(var key in listings) {
            if(key === $rootScope.currentListing.$id) {
              if(listings[key].offers === undefined) {
                listings[key].offers = [offers.keyGen];
              } else {
                listings[key].offers.push(offers.keyGen);
              }
            }
          }

          //multiple saves must be asynchronously called
          listings.$save().then(function() {
            users.$save().then(function() {
              offers.keyGen++;
              offers.$save().then(function() {
              });
            });
          });
        });
      });
    });
    
    //once everything is finished, go back to buySearch view
    $state.go('tab.buySearch');
  };
})
.controller('BuyItemOfferCtrl', function($scope) {})






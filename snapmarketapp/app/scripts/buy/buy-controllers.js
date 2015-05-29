angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($scope, $firebaseObject, $firebaseArray) {

  // alternative array type for firebase listings
    //TODO: convert to Ref
  var ref = new Firebase("https://snapmarket.firebaseio.com/listings2");
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

  // copy over full listings to the results array for display
  $scope.listings.$loaded()
    .then(function(){
      $scope.results = filterListings($scope.listings)
    });

  //filter scope.results through one tag
  $scope.filterOne = function(tag){
    $scope.results = filterListings($scope.results, tag);
  }

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
.controller('BuyItemDetailCtrl', function($scope) {})
.controller('BuyItemOfferCtrl', function($scope) {})
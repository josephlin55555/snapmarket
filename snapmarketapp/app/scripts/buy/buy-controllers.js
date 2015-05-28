angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($scope, $firebaseObject, $firebaseArray) {
  
  // provides a scope variable so the add button can access input value on search bar
  $scope.searchVal = '';

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
.directive('tagSearch', function() {

  return {
    restrict: 'E',
    replace: true,
    link: function(scope, element, attrs) {
      attrs.minLength = attrs.minLength || 0;
      scope.placeholder = attrs.placeholder || '';
      scope.search = {value: ''};
      scope.tagResults = [];
      scope.tagCloud = [];
      scope.model = scope[attrs.model];

      // when search string is modified by user, update the tag results 
      scope.filterTags = function(str) {
        //reset tagResults
        scope.tagResults = [];
        for(var i = 0; i < scope.model.length; i++){
          var tagName = scope.model[i][0]
          if(tagName.indexOf(str) === 0){
            scope.tagResults.push(scope.model[i]);
          }
        }
      };

      if (attrs.class){
        element.addClass(attrs.class);
      }
      if (attrs.watch) {
        scope.$watch('search.value', function (newValue, oldValue) {
          if (newValue.length > attrs.minLength) {
            scope.filterTags(newValue);
          } else {
            scope.tagResults = [];
          }
        });
      }

      //add a tag to tag cloud
      scope.addTag = function(string, callback){
        if(string){
          string = string.toLowerCase();
          if(scope.tagCloud.indexOf(string < 0)){
            scope.tagCloud.push(string);
          }
        }
        scope.clearSearch();
        if(callback){
          callback(string, scope.tagCloud);
        }
      }

      //remove tag from tag cloud when we press on tag
      scope.removeTag = function(string, callback){
        var index = scope.tagCloud.indexOf(string);
        if(string && index > -1){
          scope.tagCloud.splice(index, 1);
        }
        if(callback){
          callback(string, scope.tagCloud);
        }
      }

      scope.clearSearch = function() {
          scope.search.value = '';
          scope.tagResults = [];
      };

  },
    template: '<div class="item-input-wrapper">' +
                '<i class="icon ion-android-search"></i>' +
                '<input type="search" placeholder="{{placeholder}}" ng-model="search.value" >' +
                '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
              '</div>'
  };
})
.controller('BuyItemDetailCtrl', function($scope) {})
.controller('BuyItemOfferCtrl', function($scope) {})
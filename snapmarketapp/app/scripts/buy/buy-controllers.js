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

  // download tags into a local object for search
  var tags = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/tags"));
  $scope.tags = [];
  $scope.tagResults = [];

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

  // when search string is modified by user, update the results tag 
  $scope.showResults = function(str) {
    //reset tagResults
    $scope.tagResults = [];
    for(var i = 0; i < $scope.tags.length; i++){
      var tagName = $scope.tags[i][0]
      if(tagName.startsWith(str)){
        $scope.tagResults.push($scope.tags[i]);
      }
    }
    return $scope.tagResults;
  };

  $scope.tagCloud = [];

  //create a function to add a tag to tag cloud
  $scope.addTag = function(string){
    if(string && $scope.tagCloud.indexOf(string) < 0){
      $scope.tagCloud.push(string);
    }

    //filter scope.results
    $scope.results = filterListings($scope.results, string);
    console.log($scope.results);
  }

  //remove tag from tag cloud when we press 'x' on tag
  $scope.removeTag = function(string){
    var index = $scope.tagCloud.indexOf(string);
    if(string && index > -1){
      $scope.tagCloud.splice(index, 1);
    }

    //recompute scope.results
    $scope.results = filterListings($scope.listings)
    for(var i = 0; i < $scope.tagCloud.length; i++){
      var tag = $scope.tagCloud[i];
      $scope.results = filterListings($scope.results, tag);
    }
    console.log($scope.results);
  }


})
.directive('ionSearch', function() {
  //TODO: remove isolated scope so parent may easily access value
  return {
    restrict: 'E',
    replace: true,
    scope: {
        getData: '&source',
        model: '=?',
        search: '=?filter'
        },
    link: function(scope, element, attrs) {
      attrs.minLength = attrs.minLength || 0;
      scope.placeholder = attrs.placeholder || '';
      scope.search = {value: ''};
      if (attrs.class){
        element.addClass(attrs.class);
      }
      if (attrs.source) {
        scope.$watch('search.value', function (newValue, oldValue) {
          if (newValue.length > attrs.minLength) {
            scope.$parent.searchVal = newValue;
            scope.model = scope.getData({str: newValue});
          } else {
            scope.model = [];
          }
        });
      }
    scope.clearSearch = function() {
        scope.search.value = '';
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
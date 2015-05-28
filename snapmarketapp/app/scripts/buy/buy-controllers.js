angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($scope, $firebaseObject) {
  
  $scope.searchVal = '';

  // download the data into a local object
  var ref = new Firebase("https://snapmarket.firebaseio.com/listings");
  var listings = $firebaseObject(ref);
  $scope.listings = [];
  $scope.results = [];

  // once listings have been loaded, place each listing into an array called $scope.listings
    //TODO: convert firebase listing object into array instead
  listings.$loaded()
    .then(function(){
      angular.forEach(listings, function(value){
        if( !angular.isFunction(value)){
          $scope.listings.push(value);
        }
      });
    })
    .catch(function(err) {
      console.error(err);
  });

  // download tags into a local object
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
  }

  //remove tag from tag cloud when we press 'x' on tag
  $scope.removeTag = function(string){
    var index = $scope.tagCloud.indexOf(string);
    if(string && index > -1){
      $scope.tagCloud.splice(index, 1);
    }
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
      console.log(scope);
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
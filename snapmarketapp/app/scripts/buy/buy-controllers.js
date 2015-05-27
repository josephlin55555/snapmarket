angular.module('buy.controllers', ['firebase'])
.controller('BuySearchCtrl', function($scope, $firebaseObject) {
  
  // download the data into a local object
  var ref = new Firebase("https://snapmarket.firebaseio.com/listings");
  var listings = $firebaseObject(ref);
  $scope.listings = [];
  $scope.results = [];

  listings.$loaded().then(function(){
    angular.forEach(listings, function(value){
      if( !angular.isFunction(value)){
        $scope.listings.push(value);
      }
    });
  })

  $scope.showResults = function(str) {
    $scope.results = [];
    for(var i = 0; i < $scope.listings.length; i++){
      var hashtag = $scope.listings[i].allTags
      if(hashtag.indexOf(str) > -1){
        $scope.results.push($scope.listings[i]);
      }
    }
    return $scope.results;
  };
  
  // once loaded, perform callback
  listings.$loaded()
    .then(function() {
      //generate all listings

    })
    .catch(function(err) {
      console.error(err);
  });
})
.directive('ionSearch', function() {
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
                '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">' +
                '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
              '</div>'
  };
})
.controller('BuyItemDetailCtrl', function($scope) {})
.controller('BuyItemOfferCtrl', function($scope) {})
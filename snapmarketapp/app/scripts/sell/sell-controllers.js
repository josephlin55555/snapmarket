angular.module('sell.controllers', [])
.controller('SellCameraCtrl', function($scope , Camera) {
  $scope.getPhoto = function() {
    Camera.getPicture(
      { quality : 100,
        sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM}
    ).then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };
  $scope.dummyFunc = Camera.dummyFunc;
})
.controller('SellCreateListingCtrl', function($scope) {})
.controller('SellTagItemCtrl', function($scope) {})
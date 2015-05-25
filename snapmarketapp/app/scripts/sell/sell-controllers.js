angular.module('sell.controllers', [])
.controller('SellCameraCtrl', function($scope , Camera) {
  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      sourceType : 0,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  };
  $scope.dummyFunc = Camera.dummyFunc;
})
.controller('SellCreateListingCtrl', function($scope) {})
.controller('SellTagItemCtrl', function($scope) {})
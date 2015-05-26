angular.module('sell.controllers', [])
.controller('SellCameraCtrl', function($rootScope, $scope , $state, Camera) {

  // $scope.getPhoto = function() {
  //   console.log('running on init')
  //   Camera.getPicture().then(function(imageURI) {
  //     $rootScope.lastPhoto=imageURI;
  //     $state.go('tab.sellCreateListing');
  //   }, function(err) {
  //     console.err(err);
  //   }, {
  //     quality: 100,
  //     sourceType : 1,
  //     targetWidth: 750,
  //     targetHeight: 1334,
  //     saveToPhotoAlbum: true
  //   });
  // };

  /* Currently the photo functionality only works if you use ionic review on you iPhone. Uncomment this code and comment out above to
  test in emulator or on browser */

  $scope.getPhoto = function() {
    console.log('running on init');
    $rootScope.lastPhoto = '../img/IMG_1379.JPG';
      console.log("Last Photo",$rootScope.lastPhoto);

      console.log($rootScope.lastPhoto);
    $state.go('tab.sellCreateListing');
  };


})
.controller('SellCreateListingCtrl', function($rootScope , $scope ) {
  var headerBarOffset = 44;
  var getTap = function(event){
    var tap = { x:0, y:0 };
    if(event.gesture.touches.length>0){
      tt = event.gesture.touches[0];
      tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
      tap.y = tt.clientY || tt.pageY || tt.screenY ||0;  
    }
    return {x : tap.x , y : tap.y-headerBarOffset};
  }
  $scope.position = function(tap){
    return {position: 'absolute',
            left: tap.x+'px',
            top: tap.y+'px'};
  };

  $scope.tags=[];
  $scope.addTag = function(){
    console.log(getTap(event));
    $scope.tags.push(getTap(event));
  };
})
.controller('SellTagItemCtrl', function($scope) {})
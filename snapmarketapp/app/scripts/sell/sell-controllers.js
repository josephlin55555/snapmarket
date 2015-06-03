angular.module('sell.controllers', ['ngCordova'])
//controller for default state when clicking on sell tab
.controller('SellCameraCtrl', function($rootScope, $scope , $state , $firebaseObject , $cordovaCamera , Camera) {


        var options = { 
            quality : 75, 
            destinationType : 0, 
            sourceType : 1, 
            allowEdit : true,
            encodingType: 0,
            targetWidth: 750,
            targetHeight: 1000,
            saveToPhotoAlbum: false
        };

  $scope.getPhoto = function() {
    console.log('running on init',Camera.cameraExists(),options);
    //for development if the camera does not exists redirect to a static image
    if(!Camera.cameraExists()){
      $scope.db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/listings/1112223334"))
      $scope.db.$loaded().then(
        function(data){
          $rootScope.lastPhoto=data.img;
          $state.go('tab.sellCreateListing');
        });
    } else{
       
      Camera.getPicture(options).then(function(imageURI) {
        $rootScope.lastPhoto="data:image/jpeg;base64," + imageURI;
        $state.go('tab.sellCreateListing');
      }, function(err) {
        console.err(err);
      });
    }
  };

})



.controller('SellCreateListingCtrl', function($rootScope , $scope , $ionicModal , $state, $firebaseArray , $ionicPopover, $ionicPosition  ) {

  $scope.db = $firebaseArray(new Firebase("https://snapmarket.firebaseio.com/listings2"));

  $scope.db.$loaded()
  .then(function() {
    console.log('finished loading firebase:', $scope.db);
  })
  .catch(function(err) {
    console.error(err);
  });

  $scope.title = 'Tag Your Things';
  $scope.lastPhoto = $rootScope.lastPhoto;

  //this is the newItem for the modal to use. It is set to the tap.

  $scope.newItem = {};

  //array of tagged items will be synced with DB on submit

  $scope.items=[];

  //modal for tagging

  $ionicModal.fromTemplateUrl('templates/sell-tagModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  };
  
  $scope.closeModal = function(save) {
    //this is triggered by clicking the x
    if(!save){
      $scope.newItem = {};
    } 
    $scope.modal.hide();
  };

  $scope.$on('modal.hidden', function() {
    //the new tag is empty because modal was exited
    //else
    if($scope.newItem.price && $scope.newItem.text){
      $scope.items.push($scope.newItem);
      $scope.newItem={};
    }
  });


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
    return {'font-size': '20px',
      position: 'absolute',
            left: tap.x+'px',
            top: tap.y+'px'};
  };


  $scope.addItem = function(){
    console.log($rootScope.profile);
    var tagTouchRadius = 100;
    var tap = getTap(event);
    var existing = false;
    for(var i = 0; i < $scope.items.length; i++){
      if(Math.sqrt( (tap.x-$scope.items[i].x)*(tap.x-$scope.items[i].x) + (tap.y-$scope.items[i].y)*(tap.y-$scope.items[i].y)) <= tagTouchRadius){
        $scope.newItem = $scope.items.splice(i,1)[0];
        existing=true;
        console.log('ALL items',$scope.items,'EXISTING TAG',$scope.newItem);
      }
    }
    if(!existing){
      $scope.newItem=tap;
    }
    $scope.openModal();
  };

  var allTags = function(){
    var result = '';
    for(var i = 0; i < $scope.items.length; i++){
      result+=' '+$scope.items[i].text;
    }
    return result;
  }

  var getUserForTesting = function(){
    if($rootScope.profile){
      return $rootScope.profile.uid;
    }
    return 'Test User';
  };

  //syncs listing with fb and redirect to sell listings tab

  $scope.submitListing = function(){

    var listing = {
      user : getUserForTesting(),
      title : $scope.title,
      img : $scope.lastPhoto || null,
      items : $scope.items,
      allTags : allTags()
    }
    if($scope.items.length>0){
      $scope.modal.remove();
      $scope.db.$add(listing).then(console.log('SUBMIT LISTING'));
      $state.go('tab.sellListings');
    }
  };

  //popover for editing title 
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

})

.controller('SellTagItemCtrl', function($scope) {})
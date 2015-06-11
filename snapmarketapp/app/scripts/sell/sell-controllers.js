angular.module('sell.controllers', ['ngCordova'])
//controller for default state when clicking on sell tab
.controller('SellCameraCtrl', function($rootScope, $scope , $state , $firebaseObject , $cordovaCamera , Camera ) {


        var options = { 
            quality : 10, 
            destinationType : 0, 
            sourceType : 1, 
            allowEdit : true,
            encodingType: 0,
            targetWidth: 750,
            targetHeight: 1000,
            saveToPhotoAlbum: false
        };

  $scope.getPhoto = function() {
    //for development if the camera does not exists redirect to a static image
    if(!Camera.cameraExists()){
      $scope.db = $firebaseObject(new Firebase("https://snapmarket.firebaseio.com/listings"))
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



.controller('SellCreateListingCtrl', function($rootScope , $scope , $ionicModal , $state, $firebaseArray , $ionicPopover, $ionicPosition ,Db ,$ionicTabsDelegate, $ionicLoading, Profile) {

  $scope.tags = [];
  $scope.db = $firebaseArray(Db.child('listings'));
  // $scope.db.$loaded().then(function(){console.log('CONTROLLER DB',Db,$scope.db)});
  
  $scope.lastPhoto = $rootScope.lastPhoto;

  console.log($rootScope.TESTUSER,Profile($rootScope.TESTUSER));

  $scope.title = 'Tag Your Things';

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

  $scope.syncTags = function (string,tags){
    console.log('INVOKED',string,tags);
    $scope.newItem.tags=tags;
  }

  $scope.closeModal = function(save) {
    //this is triggered by clicking the x
    if(!save){
      $scope.newItem = {};
      $scope.modal.tags = [];
    } 

    if($scope.newItem.price && $scope.newItem.tags){
      $scope.newItem.id = $scope.items.length+1;
      $scope.items.push($scope.newItem);
      $scope.newItem={};
      $scope.modal.tags = [];

    }
    $scope.modal.hide();
  };



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
  $scope.position = function(item){
    return {'font-size': '20px',
      position: 'absolute',
            left: item.x+'px',
            top: item.y+'px'};
  };

  $scope.positionText = function(item){
    var offsetx = 11;
    var offsety = 21; 
    return {'font-size': '20px',
      position: 'absolute',
            left:(item.x+offsetx)+'px',
            top: (item.y+offsety)+'px',
            transform: 'rotate(-20deg) scale(.8,.8)',
            color:'#fff'};
  };





  $scope.addItem = function(){
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
    var result = [];
    $scope.items.forEach(function(item){
      item.tags.forEach(function(tag){
        if(result.indexOf(tag) < 0){
          result.push(tag);
        }
      });
    });
    return result;
  }


  //syncs listing with fb and redirect to sell listings tab
  var setItemsActive = function(){
    for(var i = 0; i < $scope.items.length; i++){
      $scope.items[i].isActive = true;
    }
  }

  //for testing

  var getAuth = function(){
    
    if(!$rootScope.production){
      return Profile($rootScope.TESTUSER);
    }
    return Db.getAuth();
  }

  $scope.submitListing = function(){
    setItemsActive();
    var listing = {
      user :  getAuth().uid,
      displayName : getAuth().name,
      status: 'active',
      title : $scope.title,
      img : $scope.lastPhoto || null,
      items : $scope.items,
      allTags : allTags(),
      createdAt : new Date().toString()
    }
    if($scope.items.length>0){
      $ionicLoading.show({
        template: 'Adding Listing...'
      });
      $scope.modal.remove();
      $scope.db.$add(listing).then(function(){
        $ionicTabsDelegate.select(2);
        $state.go('tab.transaction.sellListings');
        $ionicLoading.hide();
      });      
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
angular.module('sell.controllers', ['ngCordova'])
.controller('SellCameraCtrl', function($rootScope , $scope , $ionicModal , $state, $firebaseArray , $ionicPopover, $ionicPosition ,Db ,$ionicTabsDelegate, $ionicLoading, Profile, RenderTags, DisplayTags) {
  
 $scope.formatTags = DisplayTags;
  var startTag = function(){
    $scope.tags = [];
    $scope.db = $firebaseArray(Db.child('listings'));
    $scope.title = 'Tag Your Things';  
    $scope.newItem = {};
    $scope.items=[];
  }

  //this is the newItem for the modal to use. It is set to the tap.
  //array of tagged items will be synced with DB on submit
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

  var getTapRelativePicture = function(event){
    var tap = { x:0, y:0 };
    var element = { x:0, y:0 , sX:0 ,sY:0};
    if(event.gesture.touches.length>0){
      tt = event.gesture.touches[0];
      console.log('TOUCH',tt.target.x,tt.target.y,tt.clientX , tt.clientY);
      tap.x = tt.clientX || 0;
      tap.y = tt.clientY || 0;
      if(!$scope.pictureSize){
        element.x = tt.target.x || 0;
        element.y = tt.target.y || 0;
        element.sX = tt.target.offsetWidth;
        element.sY = tt.target.offsetHeight;  
        $scope.pictureSize = element;
      }
      element = $scope.pictureSize;
    }
    return {tap : tap,
            element : element,
            x : (tap.x - element.x) / element.sX,
            y : (tap.y - element.y) / element.sY,
          };
  };

  $scope.position = function(item){
    console.log(RenderTags(item,$scope.pictureSize,{x:-72,y:-82}));
    return RenderTags(item,$scope.pictureSize,{x:-72,y:-82});
  };

  $scope.positionText = function(item){
    console.log(RenderTags(item,$scope.pictureSize,{x:-61,y:-61},{transform: 'rotate(-20deg) scale(.8,.8)', color:'#fff'}));
    return RenderTags(item,$scope.pictureSize,{x:-61,y:-61},{transform: 'rotate(-20deg) scale(.8,.8)', color:'#fff'});  
  };

  $scope.addItem = function(){
    if(!$scope.newItem) startTag();
    $scope.newItem = getTapRelativePicture(event);
    console.log('OPENING MODAL WITH' , $scope.newItem);
    $scope.openModal();
  };

  $scope.removeItem = function(i){
    $scope.items.splice(i,1);
  }

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
      img : $rootScope.lastPhoto || null,
      items : $scope.items,
      allTags : allTags(),
      createdAt : new Date().toString()
    }
    if($scope.items.length>0){
      $ionicLoading.show({
        template: 'Adding Listing...'
      });
      $scope.db.$add(listing).then(function(){
        $ionicTabsDelegate.select(2);
        $rootScope.lastPhoto = null;
        startTag();
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

});
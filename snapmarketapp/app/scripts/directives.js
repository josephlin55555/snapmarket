angular.module('starter.directives', ['wu.masonry'])
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
      scope.enterCallback = scope[attrs.enterCallback] || null;

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
      };

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
      };

      //remove tag from tag cloud when we press on tag
      scope.removeTag = function(string, callback){
        var index = scope.tagCloud.indexOf(string);
        if(string && index > -1){
          scope.tagCloud.splice(index, 1);
        }
        if(callback){
          callback(string, scope.tagCloud);
        }
      };

      scope.removeAllTags = function(){
        scope.tagCloud = [];
      }

      scope.clearSearch = function() {
        scope.search.value = '';
        scope.tagResults = [];
      };

      scope.enter = function(keyEvent) {
        if (keyEvent.which === 13){
          scope.addTag(scope.search.value, scope.enterCallback);
        }
      }
  },
    template: '<div class="item-input-wrapper">' +
                '<i class="icon ion-android-search"></i>' +
                '<input type="search" placeholder="{{placeholder}}" ng-model="search.value" ng-keypress="enter($event)">' +
                '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>' +
              '</div>'
  };
});


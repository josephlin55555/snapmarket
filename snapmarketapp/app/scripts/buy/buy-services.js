angular.module('buy.services', [])

.factory('DisplayTags', function() {
  return function (tagArray){
    var result = '';
    for(var i = 0;i < tagArray.length; i++){
    	result+=tagArray[i];
    	if(i < tagArray.length-1) result+=',';
    }
    return result;
  };
});
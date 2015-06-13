angular.module('sell.services', [])

.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      console.log('OPTIONS',options);
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {        
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    cameraExists: function(){
      return navigator.camera !== undefined;
    }
  }
}])

.factory('RenderTags' , function(){
  //item will have an x & y property that are relative to the original picture. i.e. the midle is x:50 y:50
  //the element is the picture as currently rendered on the screen
  return function (item, element, offset, extraCSS){
      if(!offset) offset = {x:0,y:0};
      if(!extraCSS) extraCSS = {};
      var css = {'font-size': '20px',
                  position: 'absolute',
                  left: ((item.x * element.sX) + element.x + offset.x)+'px',
                  top:  ((item.y * element.sY) + element.y + offset.y)+'px'};
      Object.keys(extraCSS).forEach(function(key){
        css[key] = extraCSS[key];
      })
      return css;
  };
});




 
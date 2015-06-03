angular.module('sell.services', [])

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      console.log('OPTIONS',options);
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {        
        console.log('here');
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
}]);

// .factory('SaveListingFireBase' , function($firebaseObject , listing){
//   return {};
// });


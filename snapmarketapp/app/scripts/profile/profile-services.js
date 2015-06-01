angular.module('profile.services', [])
.factory('Profile', function() {
  return function (authData){
    return {
      name: authData.facebook.displayName,
      email: authData.facebook.email,
      photo: authData.facebook.cachedUserProfile.picture.data.url,
      uid : authData.uid
    }
  };
});

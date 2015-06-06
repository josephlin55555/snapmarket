angular.module('transaction.services', [])
/**
 * A simple Firebase service
 */
.factory('ChatManager', function($firebaseArray) {
  var APIUrl = 'https://snapmarket.firebaseio.com/';
  var ref = new Firebase(APIUrl);
  var postsRef = ref.child('chat');
  return {
    posts: function() {
      return $firebaseArray(postsRef.limitToLast(100));
    }
  };
});

angular.module('transaction.services', [])
/**
 * A simple Firebase service
 */
.factory('ChatManager', function($firebaseArray) {
  var APIUrl = 'https://snapmarket.firebaseio.com/offers/';
  return {
    posts: function(offerId) {
      var ref = new Firebase(APIUrl + offerId + '/messages');
      return $firebaseArray(ref.limitToLast(100));
    }
  };
});

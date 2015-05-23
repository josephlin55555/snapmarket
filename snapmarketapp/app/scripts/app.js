// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:
  .state('tab.login', {
    url: '/login',
    views: {
      'login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('tab.buySearch', {
    url: '/buySearch',
    views: {
      'buy-search': {
        templateUrl: 'templates/buy-search.html',
        controller: 'BuySearchCtrl'
      }
    }
  })
    .state('tab.buyItemDetail', {
      url: '/buySearch/:itemId',
      views: {
        'buy-ItemDetail': {
          templateUrl: 'templates/buy-itemDetail.html',
          controller: 'BuyItemDetailCtrl'
        }
      }
    })
      .state('tab.buyItemOffer', {
        url: '/buySearch/:itemId/offer',
        views: {
          'buy-ItemOffer': {
            templateUrl: 'templates/buy-itemOffer.html',
            controller: 'BuyItemOfferCtrl'
          }
        }
      })
  .state('tab.sellCamera', {
    url: '/sellCamera',
    views: {
      'sell-camera': {
        templateUrl: 'templates/sell-camera.html',
        controller: 'SellCameraCtrl'
      }
    }
  })
    .state('tab.sellCreateListing', {
      url: '/sellCamera/sellCreateListing',
      views: {
        'sell-createListing': {
          templateUrl: 'templates/sell-createListing.html',
          controller: 'SellCreateListingCtrl'
        }
      }
    })
      .state('tab.sellTagItem', {
        url: '/sellCamera/sellCreateListing/sellTagItem',
        views: {
          'sell-tagItem': {
            templateUrl: 'templates/sell-tagItem.html',
            controller: 'SellTagItemCtrl'
          }
        }
      })
  .state('tab.transactions', {
    url: '/transactions',
    views: {
      'transactions': {
        templateUrl: 'templates/transactions.html',
        controller: 'TransactionsCtrl'
      }
    }
  })
    .state('tab.buyOffers', {
      url: '/transactions/buyOffers',
      views: {
        'buy-offers': {
          templateUrl: 'templates/buy-offers.html',
          controller: 'BuyOfferCtrl'
        }
      }
    })
      .state('tab.transcationChat', {
        url: '/transactions/buyOffers/:transactionChatId',
        views: {
          'buy-transactionChat': {
            templateUrl: 'templates/buy-transactionChat.html',
            controller: 'BuyTransactionChatCtrl'
          }
        }
      })
    .state('tab.sellListings', {
      url: '/transactions/sellListings',
      views: {
        'sell-listings': {
          templateUrl: 'templates/sell-listings.html',
          controller: 'SellListingsCtrl'
        }
      }
    })
      .state('tab.sellListingItems', {
        url: '/transactions/sellListingItems',
        views: {
          'sell-listingItems': {
            templateUrl: 'templates/sell-listingItems.html',
            controller: 'SellListingItemsCtrl'
          }
        }
      })
        .state('tab.sellItemOffers', {
          url: '/transactions/sellItemOffers',
          views: {
            'sell-itemOffers': {
              templateUrl: 'templates/sell-itemOffers.html',
              controller: 'SellItemOffersCtrl'
            }
          }
        })
  .state('tab.profile', {
    url: '/profile',
    views: {
      'profile': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/buySearch');

});

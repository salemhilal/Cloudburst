'use strict';

/* App */

SC.initialize({
    client_id: '124d98e7c716fd363f37574473ddf687',
    redirect_uri: 'http://127.0.0.1:63342/Channels/index.html'
});

//http://api.soundcloud.com/users/3207.json?client_id=124d98e7c716fd363f37574473ddf687


var channelsApp = angular.module('channelsApp', [
    'ngRoute',
    'channelsControllers',
    'channelsServices'
]);

channelsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/channels/new', {
                templateUrl: 'partials/create-channel.html',
                controller: 'CreateChannelCtrl'
            }).
            when('/channels/:channelId', {
                templateUrl: 'partials/view-channel.html',
                controller: 'ViewChannelCtrl'
            }).
            otherwise({
                redirectTo: '/channels/new'
            });
    }
]);


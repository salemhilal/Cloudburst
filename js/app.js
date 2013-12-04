'use strict';

/* App */



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


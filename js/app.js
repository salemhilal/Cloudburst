'use strict';

/* App */

SC.initialize({
    client_id: '124d98e7c716fd363f37574473ddf687'
});

//http://api.soundcloud.com/users/3207.json?client_id=124d98e7c716fd363f37574473ddf687


var channelsApp = angular.module('channelsApp', [
    'ngRoute',
    'channelsControllers'
]);

channelsApp.factory('Data', function(){
    return { message: "I'm data from a service" };
})

channelsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/new', {
                templateUrl: 'partials/create-channel.html',
                controller: 'CreateChannelCtrl'
            }).
            otherwise({
                redirectTo: '/new'
            });
    }
]);

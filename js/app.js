'use strict';

/* App */

SC.initialize({
    client_id: '124d98e7c716fd363f37574473ddf687'
});

//http://api.soundcloud.com/users/3207.json?client_id=124d98e7c716fd363f37574473ddf687

var channelsServices = angular.module('channelsServices', []);

channelsServices.factory('Data', [function(){

    var Data = JSON.parse(localStorage.getItem("__channels__")) || {};
    Data.test = "v0.0.1";
    localStorage.setItem("__channels__", JSON.stringify(Data));
    return Data;
}])


var channelsApp = angular.module('channelsApp', [
    'ngRoute',
    'channelsControllers',
    'channelsServices'
]);

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


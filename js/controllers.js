/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

// Parent controller
channelsControllers.controller("ChannelCtrl", ['$scope', 'Data', function($scope, Data){
    $scope.channels = [];
}]);

// For creation of new channels
channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', CreateChannelCtrl]);

channelsControllers.controller("ViewChannelCtrl", ['$scope', 'Data', '$routeParams', '$location', function($scope, Data, $routeParams, $location){
    console.log($routeParams);
    $scope.channel = $scope.$parent.channels[$routeParams.channelId];

    if($scope.channel == undefined) {
        console.log("Undefined channel, redirecting...")
        $location.path("/new");
    }
    console.log($scope.channel);
}]);
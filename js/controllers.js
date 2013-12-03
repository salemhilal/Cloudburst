/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

// Parent controller
channelsControllers.controller("ChannelCtrl", ['$scope', 'Data', function($scope, Data){
    $scope.channels = [];
}]);

// For creation of new channels
channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', '$location', '$sce', CreateChannelCtrl]);

channelsControllers.controller("ViewChannelCtrl", ['$scope', 'Data', '$routeParams', '$location', '$sce', ViewChannelCtrl]);
/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', CreateChannelCtrl]);

channelsControllers.controller("ListChannelCtrl", ['$scope', 'Data', function($scope, Data){
    $scope.list = Data.list || ["Hey", "There", "George"]
}])
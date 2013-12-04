/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

// Parent controller
channelsControllers.controller("ChannelCtrl", ['$scope', 'Data', ChannelCtrl]);

// For creation of new channels
channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', '$location', '$sce', CreateChannelCtrl]);

// Displays a channel
channelsControllers.controller("ViewChannelCtrl", ['$scope', 'Data', '$routeParams', '$location', '$sce', ViewChannelCtrl]);

// Autocomplete module
channelsControllers.controller("AutocompleteCtrl", ['$scope', 'Data', '$location', '$sce', AutocompleteCtrl])
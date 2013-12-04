/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

// Parent controller
channelsControllers.controller("ChannelCtrl", ['$scope', 'Data', function($scope, Data){
    $scope.channels = [];

    $scope.user = null;

    $scope.loggingIn = false; // True while in the process of querying all the user's stuff.

    var pageSize = 100; // Number of elements to query at once. Max for SC is 200.

    function queryFollowings(page, me) {
        console.log("Requesting page " + page + " of user followings.");
        SC.get('/me/followings.json', {limit: pageSize, offset: (pageSize * page)}, function(followings, error) {

            // Catch errors.
            if(error) {
                console.error("Failed to request page " + page + " of user followings.");
                return;
            }

            // Are we done?
            if(followings.length == 0) {
                $scope.$apply(function(){
                    console.log("Here's Johnny!", me);
                    $scope.user = me;
                });
                return;
            }

            me.followings = me.followings.concat(followings);

            // Recurse!
            queryFollowings(page+1, me);
        });
    }



    $scope.login = function() {
        SC.connect(function(error){
            if(error) {
                console.log("Error loggin in:", error);s
                return;
            }

            // Get user info
            SC.get('/me', function(me, error) {
                if(error) {
                    console.error("Error getting user info:", error);
                    return;
                }

                // Get user's followings.
                // FIXME: In the future, do this in parallel. 
                me.followings = [];
                queryFollowings(0, me);
            });
        });
    }

}]);

// For creation of new channels
channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', '$location', '$sce', CreateChannelCtrl]);

channelsControllers.controller("ViewChannelCtrl", ['$scope', 'Data', '$routeParams', '$location', '$sce', ViewChannelCtrl]);

channelsControllers.controller("AutocompleteCtrl", ['$scope', 'Data', '$location', '$sce', AutocompleteCtrl])
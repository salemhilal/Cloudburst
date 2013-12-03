/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

// Parent controller
channelsControllers.controller("ChannelCtrl", ['$scope', 'Data', function($scope, Data){
    $scope.channels = [];
}]);

// For creation of new channels
channelsControllers.controller("CreateChannelCtrl", ['$scope', 'Data', CreateChannelCtrl]);

channelsControllers.controller("ViewChannelCtrl", ['$scope', 'Data', '$routeParams', '$location', '$sce', function($scope, Data, $routeParams, $location, $sce){

    // Get the channel for the view to make things easier.
    $scope.channel = $scope.$parent.channels[$routeParams.channelId];
    // This is the list of tracks in this view.
    $scope.channelTracks = [];

    if($scope.channel == undefined) {
        console.log("Undefined channel, redirecting...")
        $location.path("/new");
        return;
    }

    console.log($scope.channel.artists);

    for(var i = 0; i < $scope.channel.artists.length; i++) {
        var artist = $scope.channel.artists[i];
        SC.get("/users/" + artist.id + "/tracks", function(results, error) {
            if(error) {
                console.error("ERROR GETTING TRACKS FOR " + artist.username, error);
            }
            console.log(results);

            function getEmbed(track) {
                SC.oEmbed(track.permalink_url, {autoplay: false}, function(oembed) {
                    track.oembed = oembed;
                    track.oembed.trustedHtml = $sce.trustAs($sce.HTML, track.oembed.html);

                    $scope.$apply(function(){
                        $scope.channelTracks.push(track);
                    })
                });
            }

            results.forEach(getEmbed);
        });
    }




}]);
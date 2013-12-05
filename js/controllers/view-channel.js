function ViewChannelCtrl($scope, Data, $routeParams, $location, $sce){

    var prefetchPlayer = function(track) {
        console.log("Prefetching player for " + track.title);
        SC.oEmbed(track.permalink_url, {autoplay: false}, function(oembed){
            $scope.$apply(function(){
                track.oembed = oembed;
                track.oembed.trustedHtml = $sce.trustAs($sce.HTML, track.oembed.html);
            });
        });
    }

    // Makes sure each artist has all the right tracks.
    var updateTracks = function(channel) {
        console.log("Checking for artist updates");
        channel.artists.forEach(function(artist) {
            // Get all artist's tracks
            SC.get("/users/" + artist.id + "/tracks", function(tracks, error){
                tracks.forEach(function(track){
                    // Add them if they're not there yet.
                    if(_.findIndex(artist.tracks, {permalink_url : track.permalink_url}) == -1) {
                        console.log(track.title + " by " + artist.username + " has been updated.");
                        artist.push(track);
                        // and also prefetch the player.
                        prefetchPlayer(track);
                    }
                });
            });
        });
    }

    var checkTracks = function(tracks, callback) {
        console.log("Verifying track list");
        tracks.forEach(function(track) {
            if(!track.oembed || !track.oembed.trustedHtml) {
                prefetchPlayer(track);
            }
        });
        callback()  ;
    }

    // Number of elements to increase the list by at a time.
    var countInc = 8;

    // Get the channel for the view to make things easier.
    $scope.channel = $scope.$parent.channels[$routeParams.channelId];

    if($scope.channel == undefined) {
        console.log("Undefined channel, redirecting...")
        $location.path("/new");
        return;
    }

    function init() {
        // This is the list of tracks in this view.
        console.log("Generating initial track list");
        $scope.channelTracks = $scope.channel.artists.map(function(artist) {
            return artist.tracks;
        }).reduce(function(a, b) {
            return a.concat(b);
        });

        // Check the tracks, and once that's done, refresh them for recency.
        checkTracks($scope.channelTracks, function(){
            updateTracks($scope.channel);
        });
    }
    init();

    $scope.showCount = countInc;

    $scope.increaseShowCount = function(){
        $scope.showCount += countInc;
    }
    console.log($scope.channel.artists);

}
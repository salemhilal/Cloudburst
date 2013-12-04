function AutocompleteCtrl($scope, Data, $location, $sce) {
    var debounceWait = 300;     // How long to wait to send out autocomplete queries
    var suggestionCount = 8;    // Number of query results to display

    $scope.results = [];        // Autocomplete results
    $scope.selected = 0;        // Currently selected result.
    $scope.artists = $scope.$parent.artists;        // List of artists

    $scope.isQuerying = false;  // true iff we're currently querying
    $scope.failed = false;      // true iff the request has failed and a new query hasn't started.

    var autocomplete = _.debounce(function() {
        var query = $scope.queryText ? $scope.queryText.trim() : "";
        console.log("Query", query);

        // No sense querying if there's nothing to query.
        if(query.length === 0) {
            $scope.$apply(function() {
                $scope.isQuerying = false;
                $scope.results = [];
            });
            return;
        }

        // Query soundcloud based on what's in the text box.
        SC.get('/users', { q: query }, function(users, error) {

            // See if something went horribly, horribly wrong.
            if (error) {
                console.log("Error querying Soundcloud:", error.message);

                // Release query lock
                $scope.$apply(function() {
                    $scope.isQuerying = false;
                    $scope.failed = true;
                });
            } else {
                $scope.$apply(function() {
                    $scope.isQuerying = false;

                    // Clear results
                    $scope.results = [];

                    if(users.length === 0)
                        return;

                    // Populate with new ones
                    $scope.results = users.slice(0, suggestionCount);
                    $scope.selected = 0;
                });
            }
        });

        // For testing purposes. In case I don't have Wifi
        /*        setTimeout(function(){
         $scope.$apply(function(){
         $scope.isQuerying = false;
         $scope.results = [
         {
         username: "Disclosure"
         },
         {
         username: "Pretty Lights"
         },
         {
         username: "The Knocks"
         }];
         });
         }, 300);*/


    }, debounceWait);

    /*---------------------------------
     * Defines autocomplete result behavior
     *---------------------------------
     */

    // Next item
    var moveDn = function() {
        $scope.selected = Math.min($scope.selected + 1, $scope.results.length-1);
    }
    // Previous item
    var moveUp = function() {
        $scope.selected = Math.max($scope.selected -1, 0);
    }

    // Select the @idx item from the autocomplete list
    $scope.selectItem = function(idx) {
        // Ensure the correct one is bolded / selected.
        $scope.selected = idx;

        // Don't select anything if we're querying.
        if($scope.isQuerying){
            console.log("Doing nothing, isQuerying == true");
            return;
        }

        // Equality checker to ensure we don't add duplicates
        var f = function(match) {
            return function(elem) {
                return elem.username == match.username;
            }
        }
        // Don't add duplicates
        if(_.findIndex($scope.artists, { 'username': $scope.results[idx].username }) != -1){
            return;
        }

        console.log("Selected this item:", $scope.results[idx]);

        // Prefetch data and then add artist to list
        var newArtist = $scope.results[$scope.selected];
        SC.get("/users/" + newArtist.id + "/tracks", function(tracks, error) {
            if(error) {
                console.error("ERROR GETTING TRACKS FOR " + artist.username, error);
                return;
            }
            newArtist.tracks = tracks;
            newArtist.tracks.forEach(function(track){
                SC.oEmbed(track.permalink_url, {autoplay: false}, function(oembed, error){
                    if(error) {
                        console.error("ERROR GETTING OEMBED FOR " +  newArtist.username + " " + track.title);
                        return;
                    }
                    $scope.$apply(function(){
                        console.log("Prefetched player for " + track.title);
                        track.oembed = oembed;
                        track.oembed.trustedHtml = $sce.trustAs($sce.HTML, track.oembed.html);
                    });
                });
            });
        });
        $scope.artists.push(newArtist);

    }

    // Remove the @idx item from the artists list
    $scope.removeItem = function(idx) {
        console.log("Remove item", $scope.artists[idx]);
        $scope.artists.splice(idx, 1);
    }

    // Handles keypresses in the autocomplete textbox.
    // TODO: Just keep track of the previous query, see if it's changed.
    $scope.query = function(event) {
        $scope.failed = false;
        var code = event.keyCode;

        // Filter out up arrow
        if(code === 38) {
            moveUp();
            return;
        }
        // Filter out down arrow
        if(code === 40) {
            moveDn();
            return;
        }
        // Filter out enter
        if(code === 13) {
            $scope.selectItem($scope.selected);
            return;
        }
        // Clear input if we pressed delete or an alphanumeric key
        // input = 8 (delete) or btn 48 - 90, inclusive (numbers and letters)
        if(code == 8 || (code >= 48 && code <= 90)) {
            console.log("Clearing results");
            $scope.results = [];
            $scope.isQuerying = true;
            autocomplete();
        }


    };

    // Validates the input and creates a channel.
    // Clears input after.
    // TODO: Redirect app to newly created channel.
    // TODO: Put validation checks in another function.
    $scope.submit = function() {
        if(!$scope.channelName || $scope.channelName.trim() === "") {
            // TODO: Ugh, change these. Alerts are so awful.
            alert("Name that channel!");
            return;
        }
        if($scope.artists.length === 0) {
            // TODO: Here too. I feel so dirty.
            alert("Go find some artists!");
            return;
        }

        var newChannel = {
            idx: $scope.$parent.channels.length, // Reference to its own index
            name: $scope.channelName,
            artists: $scope.artists.slice(0)     // Clone the array. That'd be an annoying bug.
        }
        $scope.$parent.channels.push(newChannel);
        console.log("Setting path to /channels/"  + newChannel.idx);
        $location.path("/channels/" + newChannel.idx);

        for(var i = 0; i < $scope.$parent.channels.length; i++) {
            if($scope.$parent.channels[i].idx != i) {
                console.error("IDX MISMATCH", $scope.$parent.channels, i);
            }
        }

        $scope.channelName = "";
        $scope.artists = [];
    }

}
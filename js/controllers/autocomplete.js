function AutocompleteCtrl($scope, Data, $location, $sce) {
    SC.initialize({
        client_id: '124d98e7c716fd363f37574473ddf687',
        redirect_uri: 'http://127.0.0.1:63342/Channels/index.html'
    });

    var debounceWait = 300;                         // How long to wait to send out autocomplete queries
    var suggestionCount = 8;                        // Number of query results to display

    $scope.results = [];                            // Autocomplete results
    $scope.selected = 0;                            // Currently selected result.
    $scope.artists = $scope.$parent.artists;        // List of artists

    $scope.isQuerying = false;  // true iff we're currently querying
    $scope.failed = false;      // true iff the request has failed and a new query hasn't started.

    var autocomplete = _.debounce(function() {
        var query = $scope.queryText ? $scope.queryText.trim().toLowerCase() : "";
        console.log("Query", query);

        // No sense querying if there's nothing to query.
        if(query.length === 0) {
            $scope.$apply(function() {
                $scope.isQuerying = false;
                $scope.results = [];
            });
            return;
        }

        // Do we have an authenticated user? Then lets query his/her followings!
        if($scope.user) {
            console.log($scope.user.followings);
            console.log("Querying user's followings");
            $scope.$apply(function(){
                $scope.results = _.filter($scope.user.followings, function(following){
                    return following.username.toLowerCase().replace(/\s+/g, '').indexOf(query.replace(/\s+/g, '')) != -1;
                });
                $scope.isQuerying = false;
            });

        } else {
            console.log("Querying soundcloud users");
            // Guess no one's logged in, query everything.
            SC.get('/users', { q: query, limit: suggestionCount }, function(users, error) {

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
        }

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

}
/* Controller for creating new channels */

function CreateChannelCtrl($scope, Data, $location, $sce) {
    $scope.artists = [];        // List of artists

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
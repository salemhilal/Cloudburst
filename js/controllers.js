'use strict';

/* Controllers */

var channelsControllers = angular.module('channelsControllers', []);

channelsControllers.controller("CreateChannelCtrl", ['$scope',
    function($scope, Data) {
        console.log("Data!!!", Data);
        // How long to wait to send out autocomplete queries
        var debounceWait = 300;
        // Number of query results to display
        var suggestionCount = 8;

        // Autocomplete results
        $scope.results = [];

        // Currently selected result.
        $scope.selected = 0;

        // List of artists
        $scope.artists = [];

        $scope.isQuerying = false;
        $scope.failed = false;

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
        }, debounceWait);

        // Next item
        var moveDn = function() {
            $scope.selected = Math.min($scope.selected + 1, $scope.results.length-1);
        }
        // Previous item
        var moveUp = function() {
            $scope.selected = Math.max($scope.selected -1, 0);
        }

        // Select @item from the autocomplete list
        $scope.selectItem = function(idx) {
            // Ensure the correct one is bolded / selected.
            $scope.selected = idx;

            // Don't select anything if we're querying.
            if($scope.isQuerying){
                console.log("Doing nothing, isQuerying == true")
                return;
            }

            // Equality checker to ensure we don't add duplicates
            var f = function(match) {
                return function(elem) {
                    return elem.username == match.username;
                }
            }
            // Don't add duplicates
            if(_.findIndex($scope.artists, $scope.results[idx]) != -1){
                return;
            }

            console.log("Selected this item:", $scope.results[idx]);

            // Add selected element to artist list
            $scope.artists.push($scope.results[$scope.selected]);

        }

        $scope.removeItem = function(item) {
            console.log("Remove item", $scope.artists[item]);
            $scope.artists.splice(item, 1);
        }

        // Handles keypresses in the autocomplete textbox.
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

        // What step we're on in input.
        // 0 = Playlist Name
        // 1 = Adding artists
        // 2 = Re-editing name.
        $scope.step = 0;

        $scope.editName = true;
    }]);
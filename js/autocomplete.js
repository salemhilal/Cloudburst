function AutocompleteCtrl($scope) {
    var debounceWait = 300;

    // Autocomplete results
    $scope.results = [];

    // Autocomplete query
    $scope.query = _.debounce(function() {
        // Query soundcloud based on what's in the text box.
        SC.get('/users', { q: $scope.queryText }, function(users) {

            // Clear results
            $scope.results = [];

            // Populate with new ones
            $scope.$apply(function() {
               $scope.results = users;
            });

            console.log(users);

        });
    }, debounceWait);
}
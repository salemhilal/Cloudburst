var channelsServices = angular.module('channelsServices', []);

channelsServices.factory('Data', [function(){

    var Data = JSON.parse(localStorage.getItem("__channels__")) || {};
    Data.test = "v0.0.1";
    localStorage.setItem("__channels__", JSON.stringify(Data));
    if(!Data.channels) {
        Data.channels = [];
    }
    return Data;
}]);
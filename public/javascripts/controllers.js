/* controllers */

var cineControllers = angular.module('cineControllers', []);

cineControllers.controller('CinemaController', function($scope, $http, MovieFactory) {
    $scope.wait = "/images/wait.gif";
    $scope.movieFactory = new MovieFactory();
});

cineControllers.controller('IndexController', function($scope, $http, $timeout) {
    $scope.entries = [];
    $scope.ready = 'true';
    $scope.autoChanges=true;
    $scope.time=300;
    $scope.currentEntry = 0;

    $scope.findLastRecommandations = function() {
        $http.get('/entry/listLastRecommandationsJSON').success(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].user != null) {
                    $scope.entries.push(data[i]);
                }
            }
        });
    };
    $scope.findLastRecommandations();

    // auto carousel animation
    function doSomething() {
        if ($scope.autoChanges) {
            $scope.currentEntry = $scope.currentEntry + 1;
            if($scope.currentEntry == $scope.entries.length){
              $scope.currentEntry = 0;
            }
        }
        $timeout(doSomething, 1500 + getRandomInt(1000) + tryParseInt($scope.time, 1000));
    }
    $timeout(doSomething, 1500 + getRandomInt(1000) + tryParseInt($scope.time, 1000));

});

cineControllers.controller('UserController', function($scope, $http, $routeParams) {
    $scope.entries = [];
    $scope.recommandations = [];

    $scope.initUser = function(userId) {
        $scope.listUserLastEntriesJSON(userId);
        $scope.findUserLastRecommandations(userId);
    };

    $scope.listUserLastEntriesJSON = function(userId) {
        $http.get('/entry/user/' + userId + '/listLastEntriesJSON').success(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].user != null) {
                    $scope.entries.push(data[i]);
                }
            }
        });
    };

    $scope.findUserLastRecommandations = function(userId) {
        $http.get('/entry/user/' + userId + '/listLastRecommandationsJSON').success(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].user != null) {
                    $scope.recommandations.push(data[i]);
                }
            }
        });
    };


});

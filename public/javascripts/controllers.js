
/* controllers */

var cineControllers = angular.module('cineControllers', []);

cineControllers.controller('CinemaController', function($scope, $http, MovieFactory) {
  $scope.wait = "/images/wait.gif";
  $scope.movieFactory = new MovieFactory();
});

cineControllers.controller('IndexController', function($scope, $http) {
  $scope.entries = [];

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

});

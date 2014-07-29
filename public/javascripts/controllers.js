
/* controllers */

var cineControllers = angular.module('cineControllers', []);

cineControllers.controller('CinemaController', function($scope, $http, MovieFactory) {
  $scope.wait = "/images/wait.gif";
  $scope.movieFactory = new MovieFactory();

  $scope.showMyModal = function() {
    console.log("show modal box");
    $scope.wait = "/images/wait.gif";
    $http.get('http://mymovieapi.com/?title=Jack Reacher&type=json&plot=simple&episode=1&limit=1&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0').success(function(data) {
        console.log(data);
        console.log('display cover : ' + data[0].poster.cover);
        $scope.wait = data[0].poster.cover;
    });
  };

});

cineControllers.controller('IndexController', function($scope, $http) {
  $scope.movies = [];

  $scope.findLastRecommandations = function() {
    $http.get('/cinema/listLastRecommandationsJSON').success(function(data) {
        for (var i = 0; i < data.length; i++) {
          $scope.movies.push(data[i]);
        };
    });
  };

  $scope.findLastRecommandations();
  console.log('Nb recommandations : ' + $scope.movies.length);

});

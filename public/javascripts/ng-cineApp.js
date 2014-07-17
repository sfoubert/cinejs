var cineApp = angular.module('cineApp', ['infinite-scroll']);

// allow CORS request control
cineApp.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Controller
cineApp.controller('CinemaController', function($scope, $http, MovieFactory) {
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


// Factory
cineApp.factory('MovieFactory', function($http) {

  var MovieFactory = function() {
    this.movies = [];
    this.busy = false;
    this.idStart = 0;
  };

  MovieFactory.prototype.loadMore = function() {
    if (this.busy) return;
    this.busy = true;

      $http.get('/cinema/listJSON/' + this.idStart, {cache: true}).success(function(data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
          this.movies.push(data[i]);
        };
        this.idStart = this.movies.length;
        this.busy = false;
      }.bind(this));

  };

  return MovieFactory;
});

// Filters
cineApp.filter('dateFilter', function($filter) {
    var dateFilter = function(input) {
    return $filter('date')(input, 'dd-MM-yyyy');
  };
  return dateFilter;
});

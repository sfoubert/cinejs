var cineApp = angular.module('cineApp', ['infinite-scroll']);

cineApp.controller('CinemaController', function($scope) {
  $scope.movies = [];

  $scope.loadMore = function() {
    for(var i = 1; i <= 10; i++) {
      var movie = new Movie('Jack Reacher', null, '');
      $scope.movies.push(movie);
    }
  };
});

function Movie(title, viewdate, comment) {
    this.title = title;
    this.viewdate = viewdate;
    this.comment = comment;
}
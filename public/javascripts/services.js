
/* filters */

var cineServices = angular.module('cineServices', ['infinite-scroll']);

cineServices.factory('MovieFactory', function($http) {

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

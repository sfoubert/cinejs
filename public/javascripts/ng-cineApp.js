var cineApp = angular.module('cineApp', ['infinite-scroll']);

// allow CORS request control
cineApp.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


cineApp.controller('CinemaController', function($scope, $http) {
  $scope.wait = "/images/wait.gif";
  $scope.movies = [];

  $scope.loadMore = function() {
    for(var i = 1; i <= 10; i++) {
      var movie = new Movie('Jack Reacher', null, '');
      $scope.movies.push(movie);
    }
  };

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

function Movie(title, viewdate, comment) {
    this.title = title;
    this.viewdate = viewdate;
    this.comment = comment;
}
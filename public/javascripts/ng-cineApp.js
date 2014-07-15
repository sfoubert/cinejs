var cineApp = angular.module('cineApp', ['infinite-scroll']);

// allow CORS request control
cineApp.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


cineApp.controller('CinemaController', function($scope, $http) {
  $scope.wait = "/images/wait.gif";
  $scope.movies = [];
  $scope.idStart = 0;


  // infinite scroll
  $scope.loadMore = function() {
    console.log("loadMore ... " + $scope.movies.length);

    $http.get('/cinema/listJSON/' + $scope.idStart/*, {cache: true}*/).success(function(data, status, headers, config) {
      for (var i = 0; i < data.length; i++) {
        $scope.movies.push(data[i]);
      };
      $scope.idStart = $scope.movies.length;
    });
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


// Filters
cineApp.filter('dateFilter', function() {
  var dateFilter = function(input) {
    
    return ('date: ' + input);
  };
  return dateFilter;
});
var cineApp = angular.module('cineApp', ['infinite-scroll', 'cineControllers', 'cineServices', 'cineFilters']);

// allow CORS request control
cineApp.config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

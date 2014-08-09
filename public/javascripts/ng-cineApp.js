var cineApp = angular.module('cineApp', ['cineControllers',
    'cineServices',
    'cineFilters',
    'infinite-scroll',
    'ngAnimate'
]);

// allow CORS request control
cineApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function tryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str != null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}

'use strict';

/* filters */

var cineFilters = angular.module('cineFilters', []);

// Filters
cineFilters.filter('dateFilter', function($filter) {
    var dateFilter = function(input) {
    return $filter('date')(input, 'dd-MM-yyyy');
  };
  return dateFilter;
});

cineFilters.filter('percentFilter', function() {
    var percentFilter = function(input) {
      if(input == null || input == '') return '';
      else return input + ' %';
  };
  return percentFilter;
});

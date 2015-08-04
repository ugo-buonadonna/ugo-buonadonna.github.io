'use strict';

angular.module('mean.pivotal-tracker').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('pivotalTracker API usage page', {
      url: '/pivotalTracker/example',
      templateUrl: 'pivotal-tracker/views/index.html'
    });
  }
]);

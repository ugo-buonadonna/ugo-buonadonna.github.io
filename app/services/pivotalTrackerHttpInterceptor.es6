'use strict';

angular.module('mean.pivotal-tracker').config(["$httpProvider", function ($httpProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

    /* $httpProvider.defaults.headers.get = {'Access-Control-Allow-Origin' : '*',
        'X-TrackerToken' : '222069cee93cc9a8651bb4bcccc2c5d7' };

    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {
                //console.log(config.headers);
                return config;
            },
        }
    });*/
}]);
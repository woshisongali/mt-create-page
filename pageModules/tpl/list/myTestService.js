define([
    'app'
], function(app) {
    app.factory('myTestService', service);
    service.$inject = ['$http'];

    const getTest = params => {
        return service.$http({
            method: 'get',
            url: basePath + '/oas/self/r/afterSales/customer/info',
            params
        })
    }
    
    function service($http) {
        service.$http = $http;
        return {
            getTest
        }
    }
});
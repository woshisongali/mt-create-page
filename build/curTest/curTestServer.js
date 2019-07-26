define(['app'], function (app) {
    app.factory('curTestServer', server);
    server.$http = ['$http'];
    const getSalesAreaList = params => {
        return server.$http({
            method: 'get',
            url: basePath + '/oas/self/r/afterSales/customer/info',
            params
        });
    };
    const getDataList = params => {
        return server.$http({
            method: 'get',
            url: basePath + '/oas/self/r/afterSales/customer/info',
            params
        });
    };
    const getTest = params => {
        return server.$http({
            method: 'get',
            url: basePath + '/oas/self/r/afterSales/customer/info',
            params
        });
    };
    function server($http) {
        server.$http = $http;
        return {
            getDataList,
            getTest
        };
    }
});
define(['app'], function (app) {
    app.factory('priceAdjApplyListServer', server);
    server.$inject = ['$http'];
    const getTestfunc = params => {
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
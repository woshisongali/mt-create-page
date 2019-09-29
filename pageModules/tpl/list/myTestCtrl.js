define([
    'app',
    './myTestService'
], function (app) {

    const $inject = [
        'buServices',
        'goodsServices',
        'myTestService',
        'Page',
        '$uixNotify',
        '$stateParams',
        '$scope'
    ];

    class myTestCtrl {
        // look you can do something
        /**
         * fdgdsfdsf
         */

        constructor() {
            const vm = this;
            let [
                buServices,
                goodsServices,
                myTestService,
                Page,
                $uixNotify,
                $stateParams,
                $scope
            ] = arguments;
            vm.buServices = buServices;
            vm.goodsServices = goodsServices;
            vm.service = myTestService;
            vm.$uixNotify = $uixNotify;
            vm.$stateParams = $stateParams;
            vm.$scope = $scope;
            Page.setTitle('XXXX-XXXX');
            vm.init();
        }

        init() {
            this.pages = {
                pageSize: 20,
                pageNo: 1
            };
            this.submitParams = {};
            this.dataList = [];
            this.initQuery();
            this.getDataList(1);
        }

        initQuery() {
            this.params = {};
        }

        getDataList(viaBtn) {
            viaBtn ? this.updateQueryParams() : '';

            this.submitParams.pageNo = this.pages.pageNo = viaBtn === 1 ? 1 : this.pages.pageNo;
            let params = this.submitParams;
            this.tableLoader = 1;
            this.service.getDataList(params).then(
                ({ data: { data, status } }) => {
                    if (status) {
                        let dataList = data.pageContent || [];
                        this.tableComp.dataList = angular.copy(dataList);
                        this.pages.pageNo = data.page.currentPageNo;
                        this.pages.totalCount = data.page.totalCount;
                        this.pages.pageSize = data.page.pageSize;
                        this.tableLoader =this.dataList.length > 0 ? 0 : 2;
                    } else {
                        this.tableLoader = -1;
                    }
                },
                () => {
                    this.tableLoader = -1;
                }
            );
        }

        updateQueryParams() {
            console.log('you can change here about url Params')
            this.submitParams = Object.assign({}, this.pages, this.params);
        }
    }

    myTestCtrl.$inject = $inject;
    app.controller('myTestCtrl', myTestCtrl);
    return {
        _tpl: __inline('./myTest.html')
    };
});
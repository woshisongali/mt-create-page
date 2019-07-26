define([
    'app',
    './curTestServer'
], function (app) {
    const $inject = [
        'buServices',
        'goodsServices',
        'curTestServer',
        'Page',
        '$uixNotify'
    ];
    class curTestCtrl {
        constructor() {
            const vm = this;
            let [buServices, goodsServices, curTestServer, Page, $uixNotify] = arguments;
            vm.buServices = buServices;
            vm.goodsServices = goodsServices;
            vm.server = curTestServer;
            vm.$uixNotify = $uixNotify;
            Page.setTitle('XXXX-XXXX');
            vm.init();
        }
        init() {
            console.log('ya to start');
            this.page = { pageSize: 20 };
            this.savedParams = {};
            this.initQuery();
            this.getDataList(1);
        }
        initQuery() {
            this.params={inputMis: null,startTime: null,endTime: null,bu: null,salesGrid: null};
        }
        getDataList(viaBtn) {
            viaBtn ? this.updateQueryParams() : '';
            this.savedParams.pageNo = this.page.pageNo = viaBtn ? 1 : this.page.pageNo;
            let params = this.savedParams;
            this.tableLoader = 1;
            this.server.getDataList(params).then(({
                data: {data, status}
            }) => {
                if (status) {
                    this.wrappageList = data.pageContent || [];
                    this.totalCount = data.totalCount || null;
                    this.totalAmount = data.totalAmount;
                    this.pages = data.page;
                    this.tableLoader = data.pageContent ? 0 : 2;
                } else {
                    this.tableLoader = -1;
                }
            }, () => {
                this.tableLoader = -1;
            });
        }
        updateQueryParams() {
            this.savedParams = Object.assign({}, this.page, this.params);
        }
        getSalesAreaList(buInfo) {
            const SELLGRIDSTATUS = {
                PRE_OPEN: '待开启',
                OPEN: '已开启'
            };
            this.salesAreaList = [];
            this.server.getSalesAreaList({
                buId: buInfo.buId,
                sellGridStatusList: [
                    'OPEN',
                    'PRE_OPEN'
                ]
            }).then(({
                data: {data, status}
            }) => {
                if (status) {
                    let openAreaList = data.filter(item => {
                        return item.sellGridStatus === 'OPEN';
                    });
                    let preOpenAreaList = data.filter(item => {
                        return item.sellGridStatus === 'PRE_OPEN';
                    });
                    this.salesAreaList = openAreaList.concat(preOpenAreaList);
                    this.salesAreaList = this.salesAreaList.map(item => {
                        return {
                            saleAreaName: `${ item.sellGridName } (${ item.id }) (${ SELLGRIDSTATUS[item.sellGridStatus] })`,
                            value: item.id
                        };
                    });
                    this.salesAreaList.unshift({ saleAreaName: '全部' });
                    if (this.$stateParams.salesGridId) {
                        this.params.salesGrid = this.salesAreaList.find(item => item.value === +this.$stateParams.salesGridId);
                    } else {
                        this.params.salesGrid = this.salesAreaList[0];
                    }
                }
            });
        }
    }
    curTestCtrl.$inject = $inject;
    app.controller('curTestCtrl', curTestCtrl);
    return { _tpl: __inline('./curTest.html') };
});
define([
    'app',
    './priceAdjApplyListServer'
], function (app) {
    const $inject = [
        'buServices',
        'goodsServices',
        'priceAdjApplyListServer',
        'Page',
        '$uixNotify'
    ];
    class priceAdjApplyListCtrl {
        constructor() {
            const vm = this;
            let [buServices, goodsServices, priceAdjApplyListServer, Page, $uixNotify] = arguments;
            vm.buServices = buServices;
            vm.goodsServices = goodsServices;
            vm.server = priceAdjApplyListServer;
            vm.$uixNotify = $uixNotify;
            Page.setTitle('XXXX-XXXX');
            vm.init();
        }
        init() {
            console.log('ya to start');
            this.page = { pageSize: 20 };
            this.savedParams = {};
            this.dataList = [];
            this.initQuery();
            this.getDataList(1);
        }
        initQuery() {
            this.params = {};
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
                    this.dataList = data.pageContent || [];
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
        changeBu(info) {
            console.log(info);
        }
    }
    priceAdjApplyListCtrl.$inject = $inject;
    app.controller('priceAdjApplyListCtrl', priceAdjApplyListCtrl);
    return { _tpl: __inline('./priceAdjApplyList.html') };
});
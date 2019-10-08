define([
    'app',
    './myTestService'
], function (app) {

    const $inject = [
        '$uixNotify',
        'myTestService',
        '$scope'
    ];

    class myTestCtrl {
        // look you can do something
        /**
         * fdgdsfdsf
         */

        constructor() {
            let [
                $uixNotify,
                myTestservice,
                $scope
            ] = arguments;
            this.$uixNotify = $uixNotify;
            this.service = myTestservice;
            this.$scope = $scope;
            this.init();
        }
        init() {

        }
        getDetail() {
            this.loader = 1;
            this.service.getDetail().then(({
                data: {data, status}
            }) => {
                if (status) {
                    this.loader = 0;
                    console.log('get the modal data');
                } else {
                    this.loader = -1;
                }
            }, () => {
                this.loader = -1;
            });
        }
    }

    myTestCtrl.$inject = $inject;
    app.controller('myTestCtrl', myTestCtrl);

    return {
        _tpl: __inline('./myTest.html')
    };
});
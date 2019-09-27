define([
    'app',
    './myTestService'
], function (app) {

    const $inject = [
        '$uixNotify',
        'myTestService'
    ];

    class myTestCtrl {
        // look you can do something
        /**
         * fdgdsfdsf
         */

        constructor() {
            let [
                $uixNotify,
                myTestservice
            ] = arguments;
            this.$uixNotify = $uixNotify;
            this.service = myTestservice;
        }

        getDetail() {
            this.tableLoader = 1;
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
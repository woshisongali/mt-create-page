define([
    'app'
], function (app) {

    const $inject = [
        'parent',
        '$uixNotify',
        '$uixModalInstance'
    ];

    class myTestCtrl {
        // look you can do something
        /**
         * fdgdsfdsf
         */

        constructor() {
            let [
                parent,
                $uixNotify,
                $uixModalInstance
            ] = arguments;
            this.parent = parent;
            this.$uixNotify = $uixNotify;
            this.$uixModalInstance = $uixModalInstance;
            this.service = myTestservice;
        }

        getDetail() {
            this.tableLoader = 1;
            this.parent.service.getDetail().then(({
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
        ok() {

        }
        cancel() {
            this.$uixModalInstance.close();
        }
    }
    myTestCtrl.$inject = $inject;
    
    return {
        template: __inline('./myTest.html'),
        controller: myTestCtrl,
        controllerAs: 'vm',
        size: 'lg'
    };
});
const pageData = {
    params: [],
    init(opts) {
        this.params = [];
        this.out = null;
        for (let key in opts) {
            if (opts.hasOwnProperty(key)) {
                this[key] = opts[key];
            }
        }
        this.initSelect();
    },
    setOutData(out) {
        this.out = out;
    },

    initSelect() {
        this.selectUUid = 0;
    },
    getSelectUUid () {
        return this.selectUUid++;
    },
    setParams(data) {
        if (~data.indexOf('pageNo')) {
            return;
        }
        if (Array.isArray(data)) {
            this.params = this.params.concat(data);
        } else {
            this.params.push(data);
        }
    }
};

module.exports = pageData;
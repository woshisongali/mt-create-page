const pageData = {
    defaultOutPath: `./build/`,
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
        this.initFuncs = [];
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
        let isObj = typeof data === 'object';
        if (!isObj && ~data.indexOf('pageNo')) {
            return;
        }
        if (Array.isArray(data)) {
            this.params = this.params.concat(data);
        } else {
            this.params.push(data);
        }
    },
    setInitFuncs(func) {
        this.initFuncs.push(func)
    },
    getInitFuncs() {
        return this.initFuncs;
    }
};

module.exports = pageData;
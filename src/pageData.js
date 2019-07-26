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
    },
    setOutData(out) {
        this.out = out;
    },

    setParams(data) {
        if (~data.indexOf('pageNo')) {
            return;
        }
        if (Array.isArray(data)) {
            this.params.concat(data);
        } else {
            this.params.push(data);
        }
    }
};

module.exports = pageData;
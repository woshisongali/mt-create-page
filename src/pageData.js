const pageData = {
    params: [],
    init() {
        this.params = [];
        this.out = null;
    },
    setOutData(out) {
        this.out = out;
    },

    setParams(data) {
        if (Array.isArray(data)) {
            this.params.concat(data);
        } else {
            this.params.push(data);
        }
    }
};

module.exports = pageData;
const Config1 = {
    tpl: './test/index.html',
    children: [
        {
            tpl: './test/one.html',
            children: null
        },
        {
            tpl: './test/two.html'
        }
    ]
}

const Config = {
    tpl: './modules/table.html', 
    type: 'table',
    space: 6,
    names: 'MIS号,账号类型,所属岗位,职务类型,部门'
}

module.exports = {
    Config
};
const Config = {
    tpl: './test/index.html',
    children: [
        {
            tpl: './test/one.html',
            children: [
                {
                    tpl: './modules/table.html', 
                    type: 'table',
                    space: 6,
                    names: 'MIS号,账号类型,所属岗位,职务类型,部门,操作'
                }
            ]
        },
        {
            tpl: './test/two.html'
        }
    ]
}

const Config1 = {
    tpl: './modules/table.html', 
    type: 'table',
    space: 6,
    names: 'MIS号,账号类型,所属岗位,职务类型,部门,操作'
}

module.exports = {
    Config
};
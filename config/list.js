const Config = {
    tpl: './test/index.html',
    children: [
        {
            tpl: './test/one.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
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
    tpl: './pageModules/table.html', 
    type: 'table',
    space: 6,
    names: 'MIS号,账号类型,所属岗位,职务类型,部门,操作'
}

const CofingList = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'curTest',
    children: [
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/form.html',
                    children: [
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'inputMis'
                        },
                        {
                            tpl: './pageModules/inputs/datepickerGroup.html',
                            paramNames: ['startTime', 'endTime']
                        },
                        {
                            tpl: './pageModules/inputs/select.html'
                        },
                        {
                            tpl: './pageModules/pubComp/saleArea.html'
                        }
                    ]
                }
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    space: 6,
                    names: 'MIS号,账号类型,所属岗位,职务类型,部门,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}

configList2 = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'priceAdjApplyList',
    children: [
        {
            tpl: './pageModules/pubComp/titleBu.html',
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    space: 5,
                    names: '调价单编码,调价类型,申请时间,调价申请单状态,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}

module.exports = configList2;
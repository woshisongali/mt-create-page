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
    tpl: './pageModules/outerNoTitle.html',
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

const CofingList3 = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'myApplyPriceList',
    children: [
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/form.html',
                    children: [
                        {
                            tpl: './pageModules/pubComp/buUnit.html'
                        },
                        {
                            tpl: './pageModules/inputs/select.html',
                            selectKey: 'applyStaus',
                            title: '审核单状态'
                        },
                        {
                            tpl: './pageModules/inputs/datepickerGroup.html',
                            paramNames: ['startTime', 'endTime']
                        },
                        {
                            tpl: './pageModules/inputs/select.html',
                            selectKey: 'adjType',
                            title: '调价类型'
                        }
                    ]
                },
                {
                    tpl: './pageModules/searchBtns.html'
                }
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    names: '审批单号,事业部,提交时间,调价类型,审核单状态,审核人,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}

const configModal1 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'adjFailModal',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '售卖区域,销售单元编码,商品名称,新单价,失败原因'
        },
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '客户ID,客户名称,失败原因'
        },
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '销售单元编码,商品名称,新单价,失败原因'
        }
    ]
}

const configDetail1 = {
    tpl: './pageModules/tpl/detail/myTest.html',
    pageType: 'detail',
    fileName: 'adjApplyDetail',
    children: [
        {
            tpl: './pageModules/form.html',
            children: []
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/singleTable.html', 
                    type: 'table',
                    names: '客户ID,客户名称,操作'
                },
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    names: '序号,商品信息,规格名称,售卖区域,原单价（元）/毛利率,采购价（元）,新单价（元）,新毛利率（%）,操作'
                },
            ]
        }
        
    ]
}

const CofingList5 = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'priceMagSearchListTest',
    children: [
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/form.html',
                    children: [
                        {
                            tpl: './pageModules/pubComp/buUnit.html'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'spuCode',
                            title:'品号'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'skuCode',
                            title:'包装规格编码'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'csuCode',
                            title:'销售单元编码'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'spuName',
                            title:'商品名称'
                        },
                        {
                            tpl: './pageModules/pubComp/brand.html'
                        },
                        {
                            tpl: './pageModules/inputs/select.html',
                            selectKey: 'allStatus',
                            title: '售卖状态'
                        },
                        {
                            tpl: './pageModules/pubComp/spuType.html'
                        },
                        {
                            tpl: './pageModules/inputs/select.html',
                            selectKey: 'salePattern',
                            title: '售卖模式'
                        },
                        {
                            tpl: './pageModules/pubComp/categories.html'
                        },
                        {
                            tpl: './pageModules/pubComp/saleArea.html'
                        }
                    ]
                },
                {
                    tpl: './pageModules/searchBtns.html'
                }
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    names: '销售单元编码,商品信息,规格名称,售卖区域,售卖状态,采购价,销售定价 (元),促销价 (元),品号,包装规格编码,事业部,后台类目,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}

const CofingList6 = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'goodsList',
    children: [
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/form.html',
                    children: [
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'spuName',
                            title:'商品名称'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'spuCode',
                            title:'品号'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'skuCode',
                            title:'包装规格编码'
                        },
                        {
                            tpl: './pageModules/inputs/input.html',
                            paramNames: 'csuCode',
                            title:'销售单元编码'
                        },
                        {
                            tpl: './pageModules/pubComp/brand.html'
                        },
                        {
                            tpl: './pageModules/pubComp/categories.html'
                        }
                    ]
                },
                {
                    tpl: './pageModules/searchBtns.html'
                }
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    names: '销售单元编码,商品信息,规格名称,售卖区域,售卖状态,采购价,销售定价 (元),促销价 (元),品号,包装规格编码,事业部,后台类目,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}

const configModal2 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'addCustoms',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '全选,客户ID,客户名称'
        }
    ]
}
const configModa3 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'batchFailGoods',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '销售单元编码,商品名称,失败原因,操作时间'
        }
    ]
}

const configModa4 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'batchFailGoods',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '销售单元编码,商品名称,失败原因,操作时间'
        }
    ]
}

const configModa5 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'excelCustomers',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '客户ID,客户名称'
        }
    ]
}

const configModa6 = {
    tpl: './pageModules/tpl/modalTpl/myTest.html',
    pageType: 'modal',
    fileName: 'excelGoods',
    children: [
        {
            tpl: './pageModules/singleTable.html', 
            type: 'table',
            names: '销售单元编码,商品信息,签约价(元),毛利率,提醒'
        }
    ]
}
const CofingList8 = {
    tpl: './pageModules/tpl/list/myTest.html',
    out: {
        origin: './temples/list/index.js'
    },
    fileName: 'priceMagSearchListTest',
    children: [
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/form.html',
                    children: [
                        {
                            tpl: './pageModules/pubComp/saleArea.html'
                        }
                    ]
                },
                {
                    tpl: './pageModules/searchBtns.html'
                }
            ]
        },
        {
            tpl: './pageModules/wrapperPanel.html',
            children: [
                {
                    tpl: './pageModules/table.html', 
                    type: 'table',
                    names: '审批单号,事业部,提交时间,调价类型,审核单状态,审核人,操作'
                },
                {
                    tpl: './pageModules/page.html'
                }
            ]
        }
    ]
}
module.exports = CofingList8;
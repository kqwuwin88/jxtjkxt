// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

const routes = [
    {
        path: '/menua',
        meta:{ ...meta, title: '短信审核', isMenu:true, icon: 'envelope-o' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/smsaudit',
                meta:{ ...meta, title: '待审核短信', isMenu:true,right:"1001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/smsexamine/smsaudit/list.vue'), meta: { ...meta, title: '待审核短信' } },
                ])('pages-smsaudit-')
            },
            {
                path: '/smsexaminelog',
                meta:{ ...meta, title: '审核日志查询', isMenu:true,right:"1002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/smsexamine/smsexaminelog/list.vue'), meta: { ...meta, title: '审核日志查询' } },
                ])('pages-smsexaminelog-')
            },

            {
                path: '/smslogexoprt',
                meta:{ ...meta, title: '审核日志下载', isMenu:true,right:"1002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/smsexamine/smslogexoprt/list.vue'), meta: { ...meta, title: '审核日志下载' } },
                ])('pages-smslogexoprt-')
            },
            
        ]
    },
    {
        path: '/menub',
        meta:{ ...meta, title: '监控配置', isMenu:true, icon: 'instagram' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/port',
                meta:{ ...meta, title: '端口管理', isMenu:true,right:"2001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/monitor/port/list.vue'), meta: { ...meta, title: '端口管理' } },
                ])('pages-port-')
            },
            {
                path: '/signature',
                meta:{ ...meta, title: '签名管理', isMenu:true,right:"2002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/monitor/signature/list.vue'), meta: { ...meta, title: '签名管理' } },
                ])('pages-signature-')
            },
            {
                path: '/smstemplete',
                meta:{ ...meta, title: '短信模板管理', isMenu:true,right:"2003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/monitor/smstemplete/list.vue'), meta: { ...meta, title: '短信模板管理' } },
                ])('pages-smstemplete-')
            },
            {
                path: '/longmsgflow',
                meta:{ ...meta, title: '长消息流控端口', isMenu:true,right:"2005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/monitor/longmsgflow/list.vue'), meta: { ...meta, title: '长消息流控端口' } },
                ])('pages-longmsgflow-')
            },
        ]
    },

    {
        path: '/menuc',
        meta:{ ...meta, title: '数据配置', isMenu:true, icon: 'cogs' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/alarm',
                meta:{ ...meta, title: '告警用户', isMenu:true,right:"3006" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/alarm/list.vue'), meta: { ...meta, title: '告警用户' } },
                ])('pages-alarm-')
            },
            {
                path: '/blacklist',
                meta:{ ...meta, title: '黑名单用户', isMenu:true,right:"3003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/blacklist/list.vue'), meta: { ...meta, title: '黑名单用户' } },
                ])('pages-blacklist-')
            },
            {
                path: '/whitelist',
                meta:{ ...meta, title: '白名单用户', isMenu:true,right:"3004" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/whitelist/list.vue'), meta: { ...meta, title: '白名单用户' } },
                ])('pages-whitelist-')
            },
            {
                path: '/keywords',
                meta:{ ...meta, title: '关键字', isMenu:true,right:"3005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/keywords/list.vue'), meta: { ...meta, title: '关键字' } },
                ])('pages-keywords-')
            },
            {
                path: '/keywordstrategys',
                meta:{ ...meta, title: '关键字策略组', isMenu:true,right:"3005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/keywordstrategys/list.vue'), meta: { ...meta, title: '关键字策略组' } },
                ])('pages-keywordstrategys-')
            },
            {
                path: '/allogeneicword',
                meta:{ ...meta, title: '异体字', isMenu:true,right:"3001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/allogeneicword/list.vue'), meta: { ...meta, title: '异体字' } },
                ])('pages-allogeneicword-')
            },
            {
                path: '/separator',
                meta:{ ...meta, title: '分隔符', isMenu:true,right:"3002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/separator/list.vue'), meta: { ...meta, title: '分隔符' } },
                ])('pages-separator-')
            },
            
        ]
    },
    {
        path: '/menu3',
        meta:{ ...meta, title: '用户管理', isMenu:true, icon: 'user-o' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/userinfo',
                meta:{ ...meta, title: '用户信息', isMenu:true,right:"5001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/user/userinfo/list.vue'), meta: { ...meta, title: '用户信息' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/user/userinfo/edit.vue'), meta: { ...meta, title: '添加用户信息' } },
                ])('pages-userinfo-')
            },
            {
                path: '/usergroup',
                meta:{ ...meta, title: '用户组', isMenu:true,right:"5002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/user/usergroup/list.vue'), meta: { ...meta, title: '用户组' } },
                    { path: 'edit', name: `${pre}edit`, component: _import('pages/user/usergroup/edit.vue'), meta: { ...meta, title: '添加用户组' } },
                ])('pages-usergroup-')
            },
            {
                path: '/userpart',
                meta:{ ...meta, title: '部门管理', isMenu:true,right:"5003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/user/userpart/list.vue'), meta: { ...meta, title: '部门管理' } },
                ])('pages-userpart-')
            },
        ]
    },
    {
        path: '/menu5',
        meta:{ ...meta, title: '统计报表', isMenu:true, icon: 'cubes' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/statsms',
                meta:{ ...meta, title: '短信流量统计', isMenu:true,right:"7001",groupType:2 },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsms/list.vue'), meta: { ...meta, title: '短信流量统计' } },
                ])('pages-statsms-')
            },
            {
                path: '/sendsmsdate',
                meta:{ ...meta, title: '短信发送量查询（按日期）', isMenu:true,right:"7001",groupType:1 },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/sendsmsdate/list.vue'), meta: { ...meta, title: '短信发送量查询（按日期）' } },
                ])('pages-sendsmsdate-')
            },
            {
                path: '/sendsmssignature',
                meta:{ ...meta, title: '短信发送量查询（按签名）', isMenu:true,right:"7001",groupType:1 },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/sendsmssignature/list.vue'), meta: { ...meta, title: '短信发送量查询（按签名）' } },
                ])('pages-sendsmssignature-')
            },
            {
                path: '/sendsmsport',
                meta:{ ...meta, title: '短信发送量查询（按端口）', isMenu:true,right:"7001",groupType:1 },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/sendsmsport/list.vue'), meta: { ...meta, title: '短信发送量查询（按端口）' } },
                ])('pages-sendsmsport-')
            },
            /* {
                path: '/statsmscrop',
                meta:{ ...meta, title: '短信流量统计【按客户】', isMenu:true,right:"5002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsmscrop/list.vue'), meta: { ...meta, title: '短信流量统计【按客户】' } },
                ])('pages-statsmscrop-')
            },
            {
                path: '/statsmsport',
                meta:{ ...meta, title: '短信流量统计【按端口】', isMenu:true,right:"5003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsmsport/list.vue'), meta: { ...meta, title: '短信流量统计【按端口】' } },
                ])('pages-statsmsport-')
            },
            {
                path: '/statsmscity',
                meta:{ ...meta, title: '短信流量统计【按省份】', isMenu:true,right:"5004" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsmscity/list.vue'), meta: { ...meta, title: '短信流量统计【按省份】' } },
                ])('pages-statsmscity-')
            },
            {
                path: '/statsmsagent',
                meta:{ ...meta, title: '短信流量统计【按代理商】', isMenu:true,right:"5005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsmsagent/list.vue'), meta: { ...meta, title: '短信流量统计【按代理商】' } },
                ])('pages-statsmsagent-')
            },
            {
                path: '/statsmsindustry',
                meta:{ ...meta, title: '短信流量统计【按行业】', isMenu:true,right:"5006" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/statistics/statsmsindustry/list.vue'), meta: { ...meta, title: '短信流量统计【按行业】' } },
                ])('pages-statsmsindustry-')
            }, */
        ]
    },
    {
        path: '/menu6',
        meta:{ ...meta, title: '运营分析', isMenu:true, icon: 'area-chart' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/statdayaccount',
                meta:{ ...meta, title: '短信流量统计【按客户】', isMenu:true,right:"6001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/business/statdayaccount/list.vue'), meta: { ...meta, title: '短信流量统计【按客户】' } },
                ])('pages-statdayaccount-')
            },
            {
                path: '/statsendtrade',
                meta:{ ...meta, title: '短信流量统计【按省份】', isMenu:true,right:"6003" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/business/statsendtrade/list.vue'), meta: { ...meta, title: '短信流量统计【按省份】' } },
                ])('pages-statsendtrade-')
            },
            {
                path: '/statmonthtrade',
                meta:{ ...meta, title: '短信流量统计【按代理商】', isMenu:true,right:"6004" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/business/statmonthtrade/list.vue'), meta: { ...meta, title: '短信流量统计【按代理商】' } },
                ])('pages-statmonthtrade-')
            },
            {
                path: '/statdaytrade',
                meta:{ ...meta, title: '短信流量统计【按行业】', isMenu:true,right:"6005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/business/statdaytrade/list.vue'), meta: { ...meta, title: '短信流量统计【按行业】' } },
                ])('pages-statdaytrade-')
            },
            
            {
                path: '/custom',
                meta:{ ...meta, title: '客户管理', isMenu:true,right:"6008" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/custom/list.vue'), meta: { ...meta, title: '客户管理' } },
                ])('pages-custom-')
            },
            {
                path: '/portlocation',
                meta:{ ...meta, title: '端口归属地管理', isMenu:true,right:"6009" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/configuration/portlocation/list.vue'), meta: { ...meta, title: '端口归属地管理' } },
                ])('pages-portlocation-')
            },
        ]
    },
    {
        path: '/menu7',
        meta:{ ...meta, title: '系统设置', isMenu:true, icon: 'cog' },
        component: { render: h => h('router-view') },
        children: [
            {
                path: '/smssetting',
                meta:{ ...meta, title: '系统配置', isMenu:true,right:"4002" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/smssetting/list.vue'), meta: { ...meta, title: '系统配置' } },
                ])('pages-smssetting-')
            },
            {
                path: '/gateway',
                meta:{ ...meta, title: '网关配置', isMenu:true,right:"4001" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/gateway/list.vue'), meta: { ...meta, title: '网关配置' } },
                ])('pages-gateway-')
            },
            
            {
                path: '/oplog',
                meta:{ ...meta, title: '操作日志', isMenu:true,right:"4005" },
                component: { render: h => h('router-view') },
                children: (pre => [
                    { path: '', name: `${pre}list`, component: _import('pages/system/oplog/list.vue'), meta: { ...meta, title: '操作日志' } },
                ])('pages-oplog-')
            },
        ]
    },
    
]

export default routes

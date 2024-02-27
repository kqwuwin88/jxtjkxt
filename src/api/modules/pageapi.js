export default ({ post,get,put,del }) => ({
    getLoginInfo: (  ) => post('/toLogin',{}),    //
    userLogin: ( queryForm ) => post('/loginExec',queryForm),    //
    getMenu: ( queryForm ) => post('/getMenu',queryForm),    //
    loginOut: ( queryForm ) => post('/loginOut',queryForm),    //
    modifyPassword: ( queryForm ) => post('/modifyMyPwd',queryForm),    //

    //短信审核
    smsCheckList: ( queryForm ) => post('/smsCheckList',queryForm),    //
    checkSms: ( queryForm ) => post('/checkSms',queryForm),    //
    addPort: ( queryForm ) => post('/addPort',queryForm),    //
    smsCheckLogList: ( queryForm ) => post('/smsCheckLogList',queryForm),    //
    checkUserList: ( queryForm ) => post('/checkUserList',queryForm),    //获取审核用户
    exportCheckLog:( queryForm ) => post('/exportCheckLog',queryForm),    //审核日志导出接口
    queryDownloadList:( queryForm ) => post('/queryDownloadList',queryForm),    //查询导出记录接口
    
    //监控配置
    portList: ( queryForm ) => post('/portList',queryForm),    //
    getPort: ( queryForm ) => post('/getPort',queryForm),    //
    modifyPort: ( queryForm ) => post('/modifyPort',queryForm),    //
    deletePort: ( queryForm ) => post('/deletePort',queryForm),    //
    importPortInfo: ( queryForm ) => post('/importPortInfo',queryForm),    //
    signList: ( queryForm ) => post('/signList',queryForm),    //
    exportSignInfo: ( queryForm ) => post('/exportSignInfo',queryForm),    //
    addSign: ( queryForm ) => post('/addSign',queryForm),    //
    getSign: ( queryForm ) => post('/getSign',queryForm),    //
    modifySign: ( queryForm ) => post('/modifySign',queryForm),    //
    deleteSign: ( queryForm ) => post('/deleteSign',queryForm),    //
    importSignInfo: ( queryForm ) => post('/importSignInfo',queryForm),    //
    smsTemplateList: ( queryForm ) => post('/smsTemplateList',queryForm),    //
    addSmsTemplate: ( queryForm ) => post('/addSmsTemplate',queryForm),    //
    getSmsTemplate: ( queryForm ) => post('/getSmsTemplate',queryForm),    //
    modifySmsTemplate: ( queryForm ) => post('/modifySmsTemplate',queryForm),    //
    deleteSmsTemplate: ( queryForm ) => post('/deleteSmsTemplate',queryForm),    //
    flowLongMsgControlList: ( queryForm ) => post('/flowLongMsgControlList',queryForm),    //
    exportFlowLongMsgControl: ( queryForm ) => post('/exportFlowLongMsgControl',queryForm),    //
    toAddFlowLongMsgControl: ( queryForm ) => post('/toAddFlowLongMsgControl',queryForm),    //
    addFlowLongMsgControl: ( queryForm ) => post('/addFlowLongMsgControl',queryForm),    //
    deleteFlowLongMsgControl: ( queryForm ) => post('/deleteFlowLongMsgControl',queryForm),    //
    alarmUserList: ( queryForm ) => post('/alarmUserList',queryForm),    //
    addAlarmUser: ( queryForm ) => post('/addAlarmUser',queryForm),    //
    getAlarmUser: ( queryForm ) => post('/getAlarmUser',queryForm),    //
    modifyAlarmUser: ( queryForm ) => post('/modifyAlarmUser',queryForm),    //
    deleteAlarmUser: ( queryForm ) => post('/deleteAlarmUser',queryForm),    //
    blackUserList: ( queryForm ) => post('/blackUserList',queryForm),    //
    addBlackUser: ( queryForm ) => post('/addBlackUser',queryForm),    //
    importBlackUser: ( queryForm ) => post('/importBlackUser',queryForm),    //
    deleteBlackUser: ( queryForm ) => post('/deleteBlackUser',queryForm),    //
    whiteUserList: ( queryForm ) => post('/whiteUserList',queryForm),    //
    addWhiteUser: ( queryForm ) => post('/addWhiteUser',queryForm),    //
    importWhiteUser: ( queryForm ) => post('/importWhiteUser',queryForm),    //
    deleteWhiteUser: ( queryForm ) => post('/deleteWhiteUser',queryForm),    //


    keywordList: ( queryForm ) => post('/keywordList',queryForm),    //
    addKeyword: ( queryForm ) => post('/addKeyword',queryForm),    //
    importKeyword: ( queryForm ) => post('/importKeyword',queryForm),    //
    getKeyword: ( queryForm ) => post('/getKeyword',queryForm),    //
    updateKeyword: ( queryForm ) => post('/updateKeyword',queryForm),    //
    deleteKeyword: ( queryForm ) => post('/deleteKeyword',queryForm),    //
    blackWordGroupList: ( queryForm ) => post('/blackWordGroupList',queryForm),    //
    addBlackWordGroup: ( queryForm ) => post('/addBlackWordGroup',queryForm),    //
    getBlackWordGroup: ( queryForm ) => post('/getBlackWordGroup',queryForm),    //
    modifyBlackWordGroup: ( queryForm ) => post('/modifyBlackWordGroup',queryForm),    //
    deleteBlackWordGroup: ( queryForm ) => post('/deleteBlackWordGroup',queryForm),    //

    specialList: ( queryForm ) => post('/specialList',queryForm),    //
    addSpecialword: ( queryForm ) => post('/addSpecialword',queryForm),    //
    deleteSpecialword: ( queryForm ) => post('/deleteSpecialword',queryForm),    //
    importSpecialword: ( queryForm ) => post('/importSpecialword',queryForm),    //
    splitList: ( queryForm ) => post('/splitList',queryForm),    //
    exportSplitword: ( queryForm ) => post('/exportSplitword',queryForm),    //
    addSplitword: ( queryForm ) => post('/addSplitword',queryForm),    //
    importSplitword: ( queryForm ) => post('/importSplitword',queryForm),    //
    deleteSplitword: ( queryForm ) => post('/deleteSplitword',queryForm),    //



    corpList: ( queryForm ) => post('/corpList',queryForm),    //
    toAddCorp: ( queryForm ) => post('/toAddCorp',queryForm),    //
    addCorp: ( queryForm ) => post('/addCorp',queryForm),    //
    getCorpInfo: ( queryForm ) => post('/getCorpInfo',queryForm),    //
    modifyCorp: ( queryForm ) => post('/modifyCorp',queryForm),    //
    deleteCorp: ( queryForm ) => post('/deleteCorp',queryForm),    //
    portConfigList: ( queryForm ) => post('/portConfigList',queryForm),    //
    getProvinceList: ( queryForm ) => post('/getProvinceList',queryForm),    //
    addPortConfig: ( queryForm ) => post('/addPortConfig',queryForm),    //
    getPortConfig: ( queryForm ) => post('/getPortConfig',queryForm),    //
    modifyPortConfig: ( queryForm ) => post('/modifyPortConfig',queryForm),    //
    deletePortConfig: ( queryForm ) => post('/deletePortConfig',queryForm),    //

    adminList: ( queryForm ) => post('/adminList',queryForm),    //
    toAddAdmin: ( queryForm ) => post('/toAddAdmin',queryForm),    //
    addAdmin: ( queryForm ) => post('/addAdmin',queryForm),    //
    toModifyAdmin: ( queryForm ) => post('/toModifyAdmin',queryForm),    //
    modifyAdmin: ( queryForm ) => post('/modifyAdmin',queryForm),    //
    modifyOtherPwd: ( queryForm ) => post('/modifyOtherPwd',queryForm),    //
    deleteAdmin: ( queryForm ) => post('/deleteAdmin',queryForm),    //


    userGroupList: ( queryForm ) => post('/userGroupList',queryForm),    //
    addUserGroup: ( queryForm ) => post('/addUserGroup',queryForm),    //
    getUserGroup: ( queryForm ) => post('/getUserGroup',queryForm),    //
    modifyUserGroup: ( queryForm ) => post('/modifyUserGroup',queryForm),    //
    deleteUserGroup: ( queryForm ) => post('/deleteUserGroup',queryForm),    //
    depList: ( queryForm ) => post('/depList',queryForm),    //
    addDep: ( queryForm ) => post('/addDep',queryForm),    //
    getDepInfo: ( queryForm ) => post('/getDepInfo',queryForm),    //
    modifyDep: ( queryForm ) => post('/modifyDep',queryForm),    //
    deleteDep: ( queryForm ) => post('/deleteDep',queryForm),    //

    smsStatistList: ( queryForm ) => post('/smsStatistList',queryForm),    //
    smsStatistCorp: ( queryForm ) => post('/smsStatistCorp',queryForm),    //
    smsStatistIndustry: ( queryForm ) => post('/smsStatistIndustry',queryForm),    //
    smsStatistPort: ( queryForm ) => post('/smsStatistPort',queryForm),    //
    smsStatistProvince: ( queryForm ) => post('/smsStatistProvince',queryForm),    //
    smsStatistAgent: ( queryForm ) => post('/smsStatistAgent',queryForm),    //

    getSysConfig: ( queryForm ) => post('/getSysConfig',queryForm),    //
    modifySysConfig: ( queryForm ) => post('/modifySysConfig',queryForm),    //
    getIsmg: ( queryForm ) => post('/getIsmg',queryForm),    //
    modifyIsmg: ( queryForm ) => post('/modifyIsmg',queryForm),    //

    smsStatistBzOfDate: ( queryForm ) => post('/smsStatistBzOfDate',queryForm),    //
    statistBzOfEnt: ( queryForm ) => post('/statistBzOfEnt',queryForm),    //
    logList: ( queryForm ) => post('/logList',queryForm),    //
    statistIndustryOfMonth: ( queryForm ) => post('/statistIndustryOfMonth',queryForm),    //
    statistCorpOfMonth: ( queryForm ) => post('/statistCorpOfMonth',queryForm),    //
    statistByIndustry: ( queryForm ) => post('/statistByIndustry',queryForm),    //
    statistCorpOfDay: ( queryForm ) => post('/statistCorpOfDay',queryForm),    //
    getCorpNumOfIndustry: ( queryForm ) => post('/modifySysConfig',queryForm),    //

    indexFlowOfTime: ( queryForm ) => post('/indexFlowOfTime',queryForm),    //
    indexFlowOfIndustry: ( queryForm ) => post('/indexFlowOfIndustry',queryForm),    //
    indexFlowOfProvince: ( queryForm ) => post('/indexFlowOfProvince',queryForm),    //
    
})

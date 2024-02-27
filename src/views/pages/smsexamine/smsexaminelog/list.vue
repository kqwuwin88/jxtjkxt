<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="端口或客户" v-model.trim="formInline.srcAddr" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.checkUser" placeholder="审核人" clearable>
                        <el-option :label="item.userName" :value="item.userName" v-for="item in checkUserList" :key="item.userName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.filterType" placeholder="拦截原因" clearable>
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="黑名单端口" value="1"></el-option>
                        <el-option label="黑名单签名" value="2"></el-option>
                        <el-option label="白名单端口" value="11"></el-option>
                        <el-option label="白名单签名" value="12"></el-option>
                        <el-option label="关键字" value="4"></el-option>
                        <el-option label="黑名单用户" value="5"></el-option>
                        <el-option label="流控" value="8"></el-option>
                        <el-option label="系统默认审核" value="3"></el-option>
                        <el-option label="系统默认发送" value="13"></el-option>
                        <el-option label="模板短信" value="10"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="处理结果">
                        <el-option label="处理结果" value="-1"></el-option>
                        <el-option label="拒发" value="0"></el-option>
                        <el-option label="发送" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="审核时间"
                        v-model="date"
                        type="datetimerange"
                        unlink-panels
                        :clearable="false"
                        range-separator="~"
                        style="width:360px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <!--<el-button type="primary" @click="exoprtListSubmit" :disabled="tableData.length===0 || userinfo.userType==0" icon="el-icon-upload2">导出</el-button>-->
                    <el-button type="primary" @click="exoprtListSubmit" :disabled="userinfo.userType==0" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px" fixed>
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="srcAddr" label="端口" width="180" fixed></el-table-column>
                    <el-table-column prop="corpName" label="客户名称" min-width="180" fixed></el-table-column>
                    <el-table-column prop="msisdn" label="手机号码" width="120"></el-table-column>
                    <el-table-column prop="areaId" label="归属地" width="120"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="180"></el-table-column>
                    <el-table-column prop="submitTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="configType" label="配置信息" width="120">
                        <template slot-scope="scope">
                            {{scope.row.configType | filterConfigType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="filterReason" label="处理策略" width="180"></el-table-column>
                    <el-table-column prop="checkUser" label="审核人" width="100"></el-table-column>
                    <el-table-column prop="checkTime" label="审核时间" width="160"></el-table-column>
                    <el-table-column prop="remark" label="处理结果" width="150"></el-table-column>
                    <el-table-column prop="delayTime" label="延时（秒）" width="100" v-if="showDelayTime !== 0"></el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'

import pagination from '@/mixins/pagination'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	data(){
		return {
            date:[],
			formInline:{
                srcAddr:'',
                msisdn:'',
                checkUser:'',
                filterType:'',
                remark:'-1',
                beginTime:'',
                endTime:'',
                status:'-1'

			},
            checkUserList:[],
            showDelayTime:'',
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
		}
	},
    filters:{
        filterRemark(val){
            const obj = {
                0:'拒发',
                1:'发送',
            }
            return obj[val] || ''
        },
        filterConfigType(val){
            const obj = {
                0:'未配置',
                1:'白名单端口',
                2:'黑名单端口',
                3:'白名单签名',
                4:'黑名单签名',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.querycheckUser();
        if(!this.hasDataCache) this.date = [moment().format('yyyy-MM-DD ') + '00:00:00',moment().format('yyyy-MM-DD ') + '23:59:59']
        this.$nextTick(()=>{
            //this.queryList();
        })
	},
  	watch: {
        date:{
            handler(val){
                if(val && val.length){
                    this.formInline.beginTime = val[0]
                    this.formInline.endTime = val[1]
                }else{
                    this.formInline.beginTime = ''
                    this.formInline.endTime = ''
                }
            },
            immediate:true
        }
    },
  	computed: {
        ...mapState('allstore', {
            userinfo: state => state.user.info,
        }),
    },
	mounted(){},
	methods:{

        //获取审核用户
        querycheckUser() {
            this.$api.checkUserList({}).then(res => {
                this.checkUserList = res.info
            }).catch(error => {
                console.log(error)
            })
        },
         //控制执行导出按钮后页面数据加载时显示时长
         loadingpage(){
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
              setTimeout(() => {
             loading.close();
            }, 20000);
        },
        
        //审核日志导出
        exoprtListSubmit(){
            if(this.formInline.filterType === '') {
            this.$notify({
                title: '告警提示',
                message: '导出审核日志需指定拦截原因！',
                type: 'warning',
            }).catch(error=>{})  
            }else{
            this.$api.exportCheckLog({srcAddr:this.formInline.srcAddr,
                msisdn:this.formInline.msisdn,checkUser:this.formInline.checkUser,
                filterType:this.formInline.filterType,remark:this.formInline.remark,
                beginTime:this.formInline.beginTime,endTime:this.formInline.endTime,
                status:this.formInline.status}).then( res => { 
                this.$message({message: '文件正在生成中,稍后请到【审核日志下载】页面获取文件！', type: 'success'});
                //this.loadingpage()
                //this.searchList();
            }).catch(error=>{})
           
            }
            
        },
        plusEdit(row){
            row.show = !row.show
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
            if(this.formInline.filterType === '' && this.formInline.checkUser === '') {
            this.$notify({
                title: '告警提示',
                message: '请选择拦截原因重试，如：关键字！',
                type: 'warning',
            }).catch(error=>{}) 
            }
            if(this.formInline.filterType == '-1' && this.formInline.checkUser === '') {
            this.$notify({
                title: '告警提示',
                message: '若拦截原因选择全部，需指定审核人！',
                type: 'warning',
            }).catch(error=>{})
            }
            if(this.formInline.filterType === ''  && this.formInline.checkUser !=='') {
            this.$notify({
                title: '告警提示',
                message: '指定审核人需与拦截原因组合查询！',
                type: 'warning',
            }).catch(error=>{})    
            }else {
            this.$api.smsCheckLogList({...this.formInline,page:this.page}).then( res => { 
                console.log(res,'ghjk');
                //this.checkUserList = res.checkUserList
                this.showDelayTime = res.showDelayTime
                this.tableData = res.info.map(item=>{
                item.show = false
                return item
                })
                this.total = res.total
			}).catch(error=>{})  

            }
            
			/*this.$api.smsCheckLogList({...this.formInline,page:this.page}).then( res => { 
                console.log(res,'ghjk');
                //this.checkUserList = res.checkUserList
                this.showDelayTime = res.showDelayTime
                this.tableData = res.info.map(item=>{
                item.show = false
                return item
                })
                this.total = res.total
			}).catch(error=>{})*/
		},
	}
}
</script>
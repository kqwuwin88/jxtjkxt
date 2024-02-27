<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="账号" v-model.trim="formInline.userName"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.logType" placeholder="请选择" style="width:100%">
                        <el-option label="日志类别" value="-1"></el-option>
                        <el-option label="用户登录" value="1"></el-option>
                        <el-option label="短信管理" value="2"></el-option>
                        <el-option label="数据配置" value="3"></el-option>
                        <el-option label="监控配置" value="4"></el-option>
                        <el-option label="用户管理" value="5"></el-option>
                        <el-option label="系统管理" value="7"></el-option>
                        <el-option label="运营分析" value="8"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="发送时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        :clearable="false"
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="exoprtList" :disabled="tableData.length===0 || userinfo.userType==0" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%" style="width:100%">
                    <el-table-column prop="staffId" label="账号" width="120"></el-table-column>
                    <el-table-column prop="corpName" label="日志类型" width="120px">
                        <template slot-scope="scope">{{scope.row.logType | filterStatus}}</template>
                    </el-table-column>
                    <el-table-column prop="logTime" label="操作时间" width="160"></el-table-column>
                    <el-table-column prop="operDesc" label="操作详情" width=""></el-table-column>
                    <el-table-column prop="userIp" label="登录IP" width="140"></el-table-column>
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
import { mapState} from 'vuex'
import pagination from '@/mixins/pagination'
import moment from 'moment'
export default {
	data(){
		return {
            date:[],
			formInline:{
                userName:'',
                logType:'-1',
                endTime:'',
                beginTime:'',
			},
			tableData:[],
		}
	},
    filters:{
        filterStatus(val){
            const obj = {
                1:'用户登录',
                2:'短信管理',
                3:'数据配置',
                4:'监控配置',
                5:'用户管理',
                7:'系统管理',
                8:'运营分析',
            }
            return obj[val] || ''
        },
        filterType(val){
            const obj = {
                0:'白名单',
                1:'黑名单',
            }
            return obj[val] || ''
        },
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
        this.$nextTick(()=>{
            this.queryList();
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
        exoprtList(){
            let str = '?'
            for (const key in this.formInline) {
                str += `${key}=${this.formInline[key]}&`
            }
            window.location.href=process.env.VUE_APP_APR + 'exportLog' + str;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.logList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},
	}
}
</script>
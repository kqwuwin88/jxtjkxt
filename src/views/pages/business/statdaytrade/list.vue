<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.timeType" placeholder="查询类型" @change="changTime">
                        <el-option label="按月" value="2"></el-option>
                        <el-option label="按年" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="formInline.timeType == 2">
                    <el-date-picker
                        title="发送时间"
                        v-model="date"
                        type="monthrange"
                        unlink-panels
                        :clearable="false"
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" v-if="formInline.timeType == 3">
                    <div flex>
                        <el-date-picker
                            title="统计时间"
                            v-model="formInline.beginTime"
                            type="year"
                            :clearable="false"
                            style="width:140px"
                            placeholder="开始时间"
                            value-format="yyyy">
                        </el-date-picker>
                        <span class="vsd-ml-5 vsd-mr-5">~</span>
                        <el-date-picker
                            title="统计时间"
                            v-model="formInline.endTime"
                            type="year"
                            :clearable="false"
                            style="width:140px"
                            placeholder="结束时间"
                            value-format="yyyy">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="exoprtList" :disabled="userinfo.userType==0" icon="el-icon-download">下载</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div flex="main:justify" style="padding:20px 20px 0">
                <el-radio-group v-model="chartType" class="radio_wrap">
                    <el-radio-button label="1">柱状图</el-radio-button>
                    <el-radio-button label="2">饼图</el-radio-button>
                </el-radio-group>
                <el-radio-group v-model="topStatus" flex class="radio_wrap" @change="queryList">
                    <el-radio-button flex-box="1" :label="1">TOP8</el-radio-button>
                    <el-radio-button flex-box="2" :label="2">TOP9-16</el-radio-button>
                    <el-radio-button flex-box="3" :label="3">TOP17-24</el-radio-button>
                    <el-radio-button flex-box="4" :label="4">TOP25-32</el-radio-button>
                </el-radio-group>
            </div>
            <chartBar v-if="chartType == '1'" :barData="barData" />
            <chartPie v-if="chartType == '2'" :barData="barData" />
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'

import pagination from '@/mixins/pagination'
import moment from 'moment'
import chartBar from '@/components/chart-bar'
import chartPie from '@/components/chart-pie'
import { mapState} from 'vuex'
export default {
	data(){
		return {
            date:[],
			formInline:{
                timeType:'2',
                endTime:'',
                beginTime:'',
			},
            topStatus:1,
            totalStatist:{},
			tableData:[],
            barData:[],
            chartType:'1',
		}
	},
    components:{
        chartBar,
        chartPie
    },
	mixins:[pagination,storeData],
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(1, 'month').format('yyyy-MM'),moment().format('yyyy-MM')]
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
        changTime(val){
            this.date = []
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计';
                    return;
                }
                sums[index] = this.totalStatist[column.property]
            })
            return sums;
        },
        exoprtList(){
            if(this.barData.length === 0) return this.$message.warning('尚不存在可以导出的数据')
            const {beginTime, endTime} = this.formInline
            const str = `?statistType=2`
            window.location.href=process.env.VUE_APP_APR + '/exportStatistCorpOrIndustry' + str;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            const beginTop = (this.topStatus-1) * 8 + 1 
            const endTop = (this.topStatus) * 8
			this.$api.smsStatistIndustry({...this.formInline,beginTop,endTop}).then( res => { 
                 this.barData = res.info
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>

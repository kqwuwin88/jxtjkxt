<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline" label-width="100px">
                <el-form-item label="">
                    <el-date-picker
                        title="日期"
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
                    <el-button type="primary" @click="exoprtList" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" v-if="refresh" class="table-border" ref="multipleTable" height="100%" :summary-method="getSummaries" show-summary>
                    <el-table-column prop="corpName" label="客户名称" width=""></el-table-column>
                    <el-table-column prop="industryName" label="所属行业" width=""></el-table-column>
                    <el-table-column prop="totalNum" label="短信条数" width=""></el-table-column>
                    <el-table-column prop="totalNumPercent" label="短信总累量占比" width=""></el-table-column>
                    <el-table-column prop="intercept" label="拦截条数" width=""></el-table-column>
                    <el-table-column prop="interceptPercent" label="拦截占比" width=""></el-table-column>
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
export default {
	data(){
		return {
            date:[],
			formInline:{
                beginTime:'',
                endTime:'',
			},
            totalStatist:{},
			tableData:[],
            refresh:false,
		}
	},
	mixins:[pagination,storeData],
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
  	computed: {},
	components: {},
	mounted(){},
	methods:{
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
            const str = `?statistType=1`
            window.location.href=process.env.VUE_APP_APR + '/exportStatistCorpOrIndustry' + str;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
            this.refresh = false
			this.$api.smsStatistCorp({...this.formInline,page:this.page}).then( res => { 
                this.tableData = res.info
                this.total = res.total
                this.totalStatist = res.totalStatist
                this.refresh = true
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
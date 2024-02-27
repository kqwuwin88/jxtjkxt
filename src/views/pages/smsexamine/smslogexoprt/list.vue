<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="当前状态">
                        <el-option label="全部" value="-1"></el-option>
                        <el-option label="生成文件中" value="0"></el-option>
                        <el-option label="已生成文件" value="1"></el-option>
                        <el-option label="生成文件失败" value="2"></el-option>
                    </el-select>
                </el-form-item>
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
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                   <!-- <el-table-column prop="id" label="文件编号" width="160"></el-table-column>-->
                    <el-table-column prop="userName" label="操作者" min-width="100"></el-table-column>
                    <el-table-column prop="opTime" label="导出时间" width=""></el-table-column>
                    <el-table-column prop="describes" label="详情" width=""></el-table-column>
                    <el-table-column prop="fileSize" label="文件大小" width="180">
                        <template slot-scope="scope">
                        {{ scope.row.fileSize }}{{ fileSizedw }}
                    </template>
                    </el-table-column>
                    <el-table-column prop="status" label="当前状态" width="160">
                        <template slot-scope="scope">
                            {{scope.row.status | filterstatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="文件下载" width="220" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="filedownload(scope.row.fileUrl)" v-if="scope.row.status ==1" plain>下载</el-button>
                        </template>
                    </el-table-column>
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
                beginTime:'',
                endTime:'',
                status:'-1'
			},
            checkUserList:[],
			tableData:[],
            fileSizedw: 'K', //文件大小单位定义
		}
	},
    filters:{
        filterstatus(val){
            const obj = {
                0:'生成文件中',
                1:'已生成文件',
                2:'生成文件失败',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.querycheckUser();
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

        //获取审核用户
        querycheckUser() {
            this.$api.checkUserList({}).then(res => {
                this.checkUserList = res.info
            }).catch(error => {
                console.log(error)
            })
        },

        //下载文件
        filedownload(fileUrl){
            //window.location.href=process.env.VUE_APP_APR+fileUrl;
            window.location.href = fileUrl;
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.queryDownloadList({...this.formInline,page:this.page}).then( res => { 
                console.log(res,'ghjk');
                this.tableData = res.info.map(item=>{
                item.show = false
                return item
                })
                this.total = res.total
			}).catch(error=>{})
		},
	}
}
</script>
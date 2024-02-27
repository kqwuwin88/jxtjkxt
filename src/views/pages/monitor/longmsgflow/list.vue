<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="端口" v-model.trim="formInline.port" />
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="创建时间"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        range-separator="~"
                        style="width:240px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="addRow()" icon="el-icon-plus">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="port" label="端口" width="200px"></el-table-column>
                    <el-table-column prop="provinceName" label="归属省份" width="200px"></el-table-column>
                    <el-table-column prop="describes" label="备注" min-width="180px"></el-table-column>
                    <el-table-column prop="addTime" label="创建时间" width="160px"></el-table-column>
                    <el-table-column label="操作" width="120" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="delRow(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="dialogEditVisible" v-if="dialogEditVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="plus" class="vsd-mr-5 m-color"/>添加长消息流控端口</div>
            <el-form :model="dialogEditForm" label-width="80px" label-position="left" ref="dialogEditForm">
                <el-form-item label="端口" prop="port" :rules="{ required: true, message: '请输入端口', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.port" placeholder="请输入端口" oninput="value=value.replace(/[^\d]/g,'')" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="所属省份" prop="province" :rules="{ required: true, message: '请输入客户名称', trigger: 'change' }">
                    <el-select v-model="dialogEditForm.province" placeholder="请选择" style="width:100%">
                        <el-option :label="item.provinceName" :value="item.id" :key="item.id" v-for="item in provinceList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="describes">
                    <el-input v-model.trim="dialogEditForm.describes"  placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditDialog" size="small">确 定</el-button>
                <el-button @click="dialogEditVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'

import pagination from '@/mixins/pagination'
import moment from 'moment'
export default {
	data(){
		return {
            provinceList:[],
            date:[],
			formInline:{
                port:'',
                beginTime:'',
                endTime:'',
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                port:'',
                province:'',
                describes:'',
                id:''
            },
		}
	},
    filters:{
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
        this.getProvince()
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
        
    },
	mounted(){},
	methods:{
        getProvince(){
            this.$api.toAddFlowLongMsgControl({}).then( res => {
                this.provinceList = res.provinceList
            }).catch(error=>{})
        },
        addRow(row){
            for (const key in this.dialogEditForm) {
                this.dialogEditForm[key] = ''
            }
            this.dialogEditVisible = true
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
        submitEditDialog(){
            this.$refs.dialogEditForm.validate((valid) => {
                if (valid) {
                    this.$api.addFlowLongMsgControl(this.dialogEditForm).then( res => {
                        this.$message.success(`操作成功`)
                        this.searchList()
                        this.dialogEditVisible = false
                    }).catch(error=>{})
                } else {
                    return false;
                }
            });
        },
        delRow(row){
      		this.$confirm('是否确认删除吗？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				this.$api.deleteFlowLongMsgControl({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.flowLongMsgControlList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info.map(item=>{
                    item.show = false
                    return item
                 })
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
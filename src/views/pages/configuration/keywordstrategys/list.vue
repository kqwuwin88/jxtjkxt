<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="策略组名称" v-model.trim="formInline.groupName" />
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
                    <el-table-column prop="groupName" label="关键字策略" width=""></el-table-column>
                    <el-table-column prop="filterType" label="拦截策略" width="100">
                        <template slot-scope="scope">
                            {{scope.row.filterType | fiFlterType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="expireType" label="过期未审策略" width="130">
                        <template slot-scope="scope">
                            {{scope.row.expireType | filterExpireType(scope.row.filterType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUser" label="创建者" width="120"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    <el-table-column prop="remark" label="备注" width="180"></el-table-column>
                    <el-table-column label="操作" width="160" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="addRow(scope.row)" plain>修改</el-button>
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
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改关键字组' : '添加关键字组'}} </div>
            <el-form :model="dialogEditForm" label-width="80px" label-position="left" ref="dialogEditForm">
                <el-form-item label="组名称" prop="groupName" :rules="{ required: true, message: '请输入组名称', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.groupName" placeholder="请输入组名称" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="拦截策略" prop="filterType" :rules="{ required: true, message: '请选择拦截策略', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.filterType">
                        <el-radio :label="2">审核</el-radio>
                        <el-radio :label="1">拒发</el-radio>
                        <el-radio :label="3">端口加黑</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="过期未审策略" prop="expireType" v-if="dialogEditForm.filterType === 2" :rules="{ required: true, message: '请选择过期未审策略', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.expireType">
                        <el-radio :label="1">拒发</el-radio>
                        <el-radio :label="2">等待审核</el-radio>
                        <el-radio :label="3">发送</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="dialogEditForm.remark"  placeholder="请输入备注"></el-input>
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
import { cloneDeep } from 'lodash'
import pagination from '@/mixins/pagination'
import moment from 'moment'
export default {
	data(){
		return {
			formInline:{
                groupName:'',
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                groupName:'',
                filterType:'',
                expireType:'',
                remark:'',
                id:''
            },
		}
	},
    filters:{
        fiFlterType(val){
            const obj = {
                1:'拒发',
                2:'审核',
                3:'端口加黑',
            }
            return obj[val] || ''
        },
        filterExpireType(val,filterType){
            if(filterType === 2){
                const obj = {
                    1:'拒发',
                    2:'等待审核',
                    3:'发送',
                }
                return obj[val] || '--'
            }
            return '--'
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.$nextTick(()=>{
            this.queryList();
        })
	},
  	watch: {
       
    },
  	computed: {
    },
	mounted(){},
	methods:{
        addRow(row){
            if(row){
                this.$api.getBlackWordGroup({id:row.id}).then( res => { 
                    this.dialogEditForm = res.info
                    this.dialogEditVisible = true
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                for (const key in this.dialogEditForm) {
                    this.dialogEditForm[key] = ''
                }
                this.dialogEditVisible = true
            }
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
        submitEditDialog(){
            this.$refs.dialogEditForm.validate((valid) => {
                if (valid) {
                    const url = this.dialogEditForm.id ? 'modifyBlackWordGroup' : 'addBlackWordGroup'
                    this.$api[url](this.dialogEditForm).then( res => {
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
				this.$api.deleteBlackWordGroup({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.blackWordGroupList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
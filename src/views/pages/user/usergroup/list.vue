<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="组名称" v-model.trim="formInline.groupName" />
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
                    <el-table-column prop="groupName" label="名称" width=""></el-table-column>
                    <el-table-column prop="groupType" label="所属类别" width="">
                        <template slot-scope="scope">
                            {{scope.row.groupType | filterGroupType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width=""></el-table-column>
                    <el-table-column prop="remark" label="备注" width=""></el-table-column>
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
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import pagination from '@/mixins/pagination'
import moment from 'moment'
import CryptoJS from 'crypto-js'
export default {
	data(){
		return {
			formInline:{
                groupName:'',
			},
			tableData:[],
		}
	},
    filters:{
        filterGroupType(val){
            const obj = {
                1:'业务组',
                2:'安全组',
            }
            return obj[val] || ''
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
    beforeRouteLeave(to, form, next){
        if(to.path === '/usergroup/edit'){
            to.meta.title = to.query.id ? '修改用户组' : '添加用户组'
        }
        next()
    },
	methods:{
        addRow(row){
            if(row){
                this.$router.push({path:'/usergroup/edit',query:{id:row.id}})
            }else{
                this.$router.push({path:'/usergroup/edit'})
            }
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
        delRow(row){
      		this.$confirm('是否确认删除吗？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				this.$api.deleteUserGroup({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.userGroupList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
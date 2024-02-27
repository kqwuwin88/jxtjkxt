<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="账号" v-model.trim="formInline.userName" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn" />
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
                    <el-table-column prop="userName" label="账号" width=""></el-table-column>
                    <el-table-column prop="msisdn" label="手机号码" width=""></el-table-column>
                    <el-table-column prop="groupName" label="用户组" width=""></el-table-column>
                    <el-table-column prop="depName" label="部门" width=""></el-table-column>
                    <el-table-column prop="locked" label="当前状态" width="100">
                        <template slot-scope="scope">
                            {{scope.row.locked | filterLocked}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="280" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="psdRow(scope.row)" plain>修改密码</el-button>
                            <el-button size="mini" type="primary" @click="addRow(scope.row)" plain>修改账户</el-button>
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
            <div slot="title"> <vsd-icon :name="'edit'" class="vsd-mr-5 m-color"/>修改密码 </div>
            <el-form :model="dialogEditForm" label-width="110px" label-position="left" ref="dialogEditForm">
                <el-form-item label="密码" prop="password" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.password" placeholder="请输入密码" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="passwordSure" :rules="{ required: true, trigger: 'blur',validator: ruleRepsd }">
                    <el-input v-model.trim="dialogEditForm.passwordSure" placeholder="请再次输入密码" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label-width="0" class="tip_form_item">
                    <p class="d-color">注 : 密码须包含字母、数字及特殊字符(如*&@#等)，长度为8~14位</p>
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
import CryptoJS from 'crypto-js'
export default {
	data(){
		return {
            pageInfo:{},
			formInline:{
                userName:'',
                msisdn:'',
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                password:'',
                passwordSure:'',
                id:'',
            },
            ruleRepsd: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入'));
                } else if (value !== this.dialogEditForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
		}
	},
    filters:{
        filterLocked(val){
            const obj = {
                0:'正常',
                1:'关闭',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        this.$nextTick(()=>{
            this.queryInfo();
            this.queryList();
        })
	},
  	watch: {
    },
  	computed: {
        
    },
	mounted(){},
    beforeRouteLeave(to, form, next){
        if(to.path === '/userinfo/edit'){
            to.meta.title = to.query.id ? '修改用户信息' : '添加用户信息'
        }
        next()
    },
	methods:{
        queryInfo(){
            return this.$api.getLoginInfo().then(res=>{
                this.pageInfo = res
            }).catch(res=>{})
        },
        Encrypt(code){
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            var srcs = CryptoJS.enc.Utf8.parse(code);  
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
            return encrypted.toString();
        },
        psdRow(row){
            this.dialogEditVisible = true
            this.dialogEditForm.id = row.id
            this.dialogEditForm.password = ''
            this.dialogEditForm.passwordSure = ''
        },
        addRow(row){
            if(row){
                this.$router.push({path:'/userinfo/edit',query:{id:row.id}})
            }else{
                this.$router.push({path:'/userinfo/edit'})
            }
        },
        searchList(){
            this.page = 1
            this.queryList()
        },
        submitEditDialog(){
            this.$refs.dialogEditForm.validate((valid) => {
                if (valid) {
                    const password = this.Encrypt(this.dialogEditForm.password)
                    this.$api.modifyOtherPwd({password,id:this.dialogEditForm.id}).then( res => {
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
				this.$api.deleteAdmin({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.adminList({...this.formInline,page:this.page}).then( res => { 
                this.provinceList = res.provinceList
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
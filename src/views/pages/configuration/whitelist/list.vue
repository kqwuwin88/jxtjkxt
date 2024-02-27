<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="端口" v-model.trim="formInline.srcAddr" />
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="addRow()" icon="el-icon-plus">添加</el-button>
                    <el-button type="primary" @click="importHandle" icon="el-icon-download">导入</el-button>
                    <el-button type="primary" @click="exoprtList" :disabled="tableData.length===0 || userinfo.userType==0" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div flex-box="0" class="vsd-mb-10">
                <el-button :disabled="multipleSelection.length===0" type="danger" plain @click="delRow()"><vsd-icon name="trash-o" class="vsd-mr-5"/>删除</el-button>
            </div>
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" @selection-change="handleSelectionChange" ref="multipleTable" height="100%">
                    <el-table-column type="selection" width="50" valign="top" align="center"></el-table-column>
                    <el-table-column prop="msisdn" label="手机号码" width=""></el-table-column>
                    <el-table-column prop="srcAddr" label="端口" width=""></el-table-column>
                    <el-table-column prop="createUser" label="创建者" width=""></el-table-column>
                    <el-table-column prop="addTime" label="创建时间" width="180"></el-table-column>
                    <el-table-column prop="addType" label="添加方式" width="">
                        <template slot-scope="scope">
                            {{scope.row.addType | filterAddType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="备注" min-width="180"></el-table-column>
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
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改白名单' : '添加白名单'}} </div>
            <el-form :model="dialogEditForm" label-width="80px" label-position="left" ref="dialogEditForm">
                <el-form-item label="端口" prop="srcAddr" :rules="{ required: true, message: '请输入端口', trigger: 'change' }">
                    <el-input v-model.trim="dialogEditForm.srcAddr" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入端口"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="msisdn" :rules="{ required: true, message: '请输入手机号码', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.msisdn" placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input v-model.trim="dialogEditForm.description"  placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditDialog" size="small">确 定</el-button>
                <el-button @click="dialogEditVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogImportVisible" v-if="dialogImportVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="download" class="vsd-mr-5 m-color"/>导入白名单 </div>
            <el-form :model="importForm" label-position="left" label-width="70px" ref="importForm">
                <el-form-item label="端口" prop="srcAddr" :rules="{ required: true, message: '请输入端口', trigger: 'blur' }">
                    <el-input v-model.trim="importForm.srcAddr" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入端口"></el-input>
                </el-form-item>
                <el-form-item label="" label-width="0">
                    <el-upload class="pic-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
                        <el-button type="primary" v-if="fileName===''">选择文件</el-button>
                        <el-button type="text" v-else>{{fileName}}</el-button>
                    </el-upload>
                    <div class="vsd-mt-5">
                        <el-button icon="el-icon-download" type="text" @click="dnTemplate">下载模板</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitImportDialog" size="small">确 定</el-button>
                <el-button @click="dialogImportVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </el-dialog>
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
			formInline:{
                msisdn:'',
                srcAddr:'',
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                msisdn:'',
                srcAddr:'',
                description:'',
            },
            dialogImportVisible:false,
            dialogFormData:null,
            fileName:'',
			multipleSelection:[],
            importForm:{
                srcAddr:''
            }
		}
	},
    filters:{
        filterAddType(val){
            const obj = {
                0:'手工添加',
                1:'文件导入',
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
        ...mapState('allstore', {
            userinfo: state => state.user.info,
        }),
    },
	mounted(){},
	methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        dnTemplate(){
            window.location.href=process.env.VUE_APP_APR+'/downloadTemplate?templateType=3';
        },
        importHandle(){
            this.fileName = ''
            this.importForm.srcAddr = ''
            this.dialogFormData = null
            this.dialogImportVisible = true
        },
        beforeAvatarUpload(file){
            const types = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
            const isJPG = (types.indexOf(file.type)>-1)
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isJPG) {
                this.$message.error('只能是excel格式!');
                return false
            }
            var formData = new FormData() // 声明一个FormData对象
            this.fileName = file.name
            formData.append('file', file);
            this.dialogFormData = formData
            return false;
		},
        submitImportDialog(){
            if(this.dialogFormData === null){
                return this.$message.warning('请选择文件')
            }
            this.$refs.importForm.validate((valid) => {
                if (valid) {
                    this.dialogFormData.append('srcAddr', this.importForm.srcAddr);
                    this.$api.importWhiteUser(this.dialogFormData).then( res => {
                        this.$message.success(`导入成功`)
                        this.searchList()
                        this.dialogImportVisible = false
                    }).catch(error=>{})
                } else {
                    return false;
                }
            });
            
        },
        exoprtList(){
            let str = '?'
            for (const key in this.formInline) {
                str += `${key}=${this.formInline[key]}&`
            }
            window.location.href=process.env.VUE_APP_APR + 'exportWhiteUser';
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
                    this.$api.addWhiteUser(this.dialogEditForm).then( res => {
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
                const ids = row ? row.id : this.multipleSelection.map(item=>item.id).join(',');
				this.$api.deleteWhiteUser({id:ids}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.whiteUserList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
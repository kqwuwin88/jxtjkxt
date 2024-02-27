<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="端口" v-model.trim="formInline.port" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="所属代理商" v-model.trim="formInline.agentName" />
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.provinceId" placeholder="归属省份" style="width:100%">
                        <el-option label="归属省份" value=""></el-option>
                        <el-option :label="item.provinceName" :value="item.id" :key="item.id" v-for="item in provinceList"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="addRow()" icon="el-icon-plus">添加</el-button>
                    <!-- <el-button type="primary" @click="importHandle" icon="el-icon-download">导入</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="port" label="端口" width="160"></el-table-column>
                    <el-table-column prop="agentName" label="所属代理商" width=""></el-table-column>
                    <el-table-column prop="proviceName" label="归属省份" width="140"></el-table-column>
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
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改客户' : '添加客户'}} </div>
            <el-form :model="dialogEditForm" label-width="80px" label-position="left" ref="dialogEditForm">
                <el-form-item label="端口" prop="port" :rules="{ required: true, message: '请输入端口', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.port" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入端口" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="代理商" prop="agentName" :rules="{ required: true, message: '请输入代理商', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.agentName" placeholder="请输入代理商名称" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="所属省份" prop="provinceId" :rules="{ required: true, message: '请选择所属省份', trigger: 'change' }">
                    <el-select v-model="dialogEditForm.provinceId" placeholder="请选择所属省份" style="width:100%">
                        <el-option :label="item.provinceName" :value="item.id" :key="item.id" v-for="item in provinceList"></el-option> 
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditDialog" size="small">确 定</el-button>
                <el-button @click="dialogEditVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogImportVisible" v-if="dialogImportVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="download" class="vsd-mr-5 m-color"/>导入客户</div>
            <el-form :model="importForm" label-position="left" label-width="100px" ref="importForm">
               
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
export default {
	data(){
		return {
			formInline:{
                port:'',
                agentName:'',
                provinceId:''
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                port:'',
                agentName:'',
                provinceId:'',
                remarks:'',
            },
            provinceList:[],
            dialogImportVisible:false,
            dialogFormData:null,
            fileName:'',
            importForm:{
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
        
    },
	mounted(){},
	methods:{
        dnTemplate(){
            window.location.href=process.env.VUE_APP_APR+'/downloadTemplate?templateType=5';
        },
        importHandle(){
            this.fileName = ''
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
            this.$refs.importWhiteUser.validate((valid) => {
                if (valid) {
                    this.$api.importKeyword(this.dialogFormData).then( res => {
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
            window.location.href=process.env.VUE_APP_APR + 'exportKeyword';
        },
        addRow(row){
            if(row){
                this.$api.getPortConfig({id:row.id}).then( res => { 
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
                    const url = this.dialogEditForm.id ? 'modifyPortConfig' : 'addPortConfig'
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
				this.$api.deletePortConfig({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.portConfigList({...this.formInline,page:this.page,query:1}).then( res => { 
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
<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="签名" v-model.trim="formInline.signName" />
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formInline.status" placeholder="状态">
                        <el-option label="状态" value="-1"></el-option>
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="暂停" value="1"></el-option>
                    </el-select>
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
                    <el-button type="primary" @click="importHandle" icon="el-icon-download">导入</el-button>
                    <el-button type="primary" @click="exoprtList" :disabled="tableData.length===0 || userinfo.userType==0" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="signName" label="签名" width="120px" fixed="left"></el-table-column>
                    <el-table-column prop="corpName" label="客户名称" min-width="180px" fixed="left"></el-table-column>
                    <el-table-column prop="signType" label="签名类型" width="100px" fixed="left">
                        <template slot-scope="scope">
                            {{scope.row.signType | filterSignType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="filterType" label="发送权限" width="150px" fixed="left">
                        <template slot-scope="scope">
                            {{scope.row.filterType | filterType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="filterBlackUser" label="过滤黑名单用户" width="140px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.filterType === 2">
                                {{scope.row.filterBlackUser | filterBlackOrKeyword}}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="filterKeyword" label="过滤关键字" width="100px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.filterType === 2">
                                {{scope.row.filterKeyword | filterBlackOrKeyword}}
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="controlType" label="流控方式" width="150px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.filterType === 2">
                                <span v-if="scope.row.controlType === 0">不流控</span>
                                <span v-if="scope.row.controlType === 1">延时发送：{{scope.row.delayTime}}秒</span>
                                <span v-if="scope.row.controlType === 2">拒发：{{scope.row.rejectPercent}}%</span>
                            </span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUser" label="创建者" width="120px"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160px"></el-table-column>
                    <el-table-column prop="addType" label="添加方式" width="100px">
                        <template slot-scope="scope">
                            {{scope.row.addType | filterAddType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="modifyUser" label="修改者" width="120px"></el-table-column>
                    <el-table-column prop="status" label="状态" width="80px">
                        <template slot-scope="scope">
                            {{scope.row.status | filterStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" v-if="userinfo.groupType === scope.row.groupType" @click="addRow(scope.row)" plain>修改</el-button>
                            <el-button size="mini" type="danger" v-if="userinfo.groupType === scope.row.groupType" @click="delRow(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="dialogEditVisible" v-if="dialogEditVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改签名' : '添加签名'}} </div>
            <el-form :model="dialogEditForm" label-width="120px" label-position="left" ref="dialogEditForm">
                <el-form-item label="签名" prop="signName" :rules="{ required: true, message: '请输入签名', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.signName" placeholder="请输入签名" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="客户名称" prop="corpName" :rules="{ required: true, message: '请输入客户名称', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.corpName" placeholder="请输入客户名称" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="签名类型" prop="signType" :rules="{ required: true, message: '请输入签名类型', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.signType">
                        <el-radio :label="0">省内签名</el-radio>
                        <el-radio :label="1">外省签名</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="发送权限" prop="filterType" :rules="{ required: true, message: '请选择发送权限', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.filterType">
                        <el-radio :label="2">白名单</el-radio>
                        <el-radio :label="1">黑名单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="dialogEditForm.filterType === 2">
                    <el-form-item label="过滤黑名单用户" prop="filterBlackUser" :rules="{ required: true, message: '请选择过滤黑名单用户', trigger: 'change' }">
                        <el-radio-group v-model="dialogEditForm.filterBlackUser">
                            <el-radio :label="0">需要</el-radio>
                            <el-radio :label="1">不需要</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="过滤关键字" prop="filterKeyword" :rules="{ required: true, message: '请选择过滤关键字', trigger: 'change' }">
                        <el-radio-group v-model="dialogEditForm.filterKeyword">
                            <el-radio :label="0">需要</el-radio>
                            <el-radio :label="1">不需要</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="流控方式" prop="controlType" :rules="{ required: true, message: '请选择流控方式', trigger: 'change' }">
                        <el-radio-group v-model="dialogEditForm.controlType">
                            <el-radio :label="0">不流控</el-radio>
                            <el-radio :label="1">延时发送</el-radio>
                            <el-radio :label="2">拒发</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="延时流控（秒）" prop="delayTime" v-if="dialogEditForm.controlType === 1" :rules="{ required: true, message: '请输入延时流控', trigger: 'blur' }">
                        <el-input v-model.trim="dialogEditForm.delayTime" oninput="value=value.replace(/[^\d]/g,'')" placeholder="最大延时"></el-input>
                    </el-form-item>
                    <el-form-item label="拒发比例" prop="rejectPercent" v-if="dialogEditForm.controlType === 2" :rules="{ required: true, message: '请输入拒发比例', trigger: 'blur' }">
                        <el-input v-model.trim="dialogEditForm.rejectPercent" oninput="value=value.replace(/[^\d]/g,'')" placeholder="0~100"></el-input>
                    </el-form-item>
                    <el-form-item label="流控关键字" prop="keyword" v-if="dialogEditForm.controlType === 2" >
                        <el-input v-model.trim="dialogEditForm.keyword"  placeholder="请输入需要流控的关键字"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="状态" prop="status" :rules="{ required: true, message: '请选择状态', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">暂停</el-radio>
                    </el-radio-group>
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
        <el-dialog :visible.sync="dialogImportVisible" v-if="dialogImportVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="download" class="vsd-mr-5 m-color"/>导入签名 </div>
            <el-upload class="pic-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
                <el-button type="primary" v-if="fileName===''">选择文件</el-button>
                <el-button type="text" v-else>{{fileName}}</el-button>
            </el-upload>
            <div class="vsd-mt-5">
                <el-button icon="el-icon-download" type="text" @click="dnTemplate">下载模板</el-button>
            </div>
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
	data(){
		return {
            date:[],
			formInline:{
                signName:'',
                status:'-1',
                beginTime:'',
                endTime:''
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                signName:'',
                corpName:'',
                signType:'',
                filterType:'',
                filterBlackUser:'',
                filterKeyword:'',
                describes:'',
                controlType:'',
                delayTime:'',
                rejectPercent:'',
                keyword:'',
                status:'',
                id:''
            },
            dialogImportVisible:false,
            dialogFormData:null,
            fileName:'',
		}
	},
    filters:{
        filterSignType(val){
            const obj = {
                0:'省内签名',
                1:'外省签名',
            }
            return obj[val] || ''
        },
        filterType(val){
            const obj = {
                2:'白名单',
                1:'黑名单',
            }
            return obj[val] || ''
        },
        filterBlackOrKeyword(val){
            const obj = {
                0:'需要',
                1:'不需要',
            }
            return obj[val] || ''
        },
        filterControlType(val){
            const obj = {
                0:'不流控',
                1:'延时发送',
                2:'拒发',
            }
            return obj[val] || ''
        },
        filterAddType(val){
            const obj = {
                0:'手工添加',
                1:'文件导入',
            }
            return obj[val] || ''
        },
        filterStatus(val){
            const obj = {
                0:'正常',
                1:'暂停',
            }
            return obj[val] || ''
        }
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        // if(!this.hasDataCache) this.date = [moment().subtract(7, 'days').format('yyyy-MM-DD'),moment().format('yyyy-MM-DD')]
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
        dnTemplate(){
            window.location.href=process.env.VUE_APP_APR+'/downloadTemplate?templateType=2';
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
            this.$api.importSignInfo(this.dialogFormData).then( res => {
                this.$message.success(`导入成功`)
                this.searchList()
                this.dialogImportVisible = false
            }).catch(error=>{})
        },
        exoprtList(){
            let str = '?'
            for (const key in this.formInline) {
                str += `${key}=${this.formInline[key]}&`
            }
            window.location.href=process.env.VUE_APP_APR + 'exportSignInfo' + str;
        },
        addRow(row){
            if(row){
                this.$api.getSign({id:row.id}).then( res => { 
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
                    const url = this.dialogEditForm.id ? 'modifySign' : 'addSign'
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
				this.$api.deleteSign({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.signList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info
                 this.total = res.total
			}).catch(error=>{
				console.log(error)
			})
		},

	}
}
</script>
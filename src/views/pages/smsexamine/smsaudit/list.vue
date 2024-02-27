<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="端口" v-model.trim="formInline.srcAddr" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="客户名称" v-model.trim="formInline.corpName" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn" />
                </el-form-item>
                <el-form-item label="">
                    <el-date-picker
                        title="发送时间"
                        v-model="date"
                        type="datetimerange"
                        unlink-panels
                        range-separator="~"
                        style="width:360px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="initList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="exoprtList" :disabled="tableData.length===0 || userinfo.userType==0" icon="el-icon-upload2">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div flex-box="0" class="vsd-mb-10">
                <el-button :disabled="multipleSelection.length===0" type="success" @click="rowPassHandle()"><vsd-icon name="check" class="vsd-mr-5"/>通过</el-button>
                <el-button :disabled="multipleSelection.length===0" type="danger" @click="rowRefuseHandle()"><vsd-icon name="ban" class="vsd-mr-5"/>拒发</el-button>
                <span class="vsd-ml-10">平台当前待审核短信：<i class="d-color">{{waitMsgNum}}</i></span>
            </div>
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" @selection-change="handleSelectionChange" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column type="selection" width="50" valign="top" align="center"></el-table-column>
                    <el-table-column prop="srcAddr" label="端口" width="100"></el-table-column>
                    <el-table-column prop="corpName" label="客户名称" min-width="180"></el-table-column>
                    <el-table-column prop="msisdn" label="数量" width="100"></el-table-column>
                    <el-table-column prop="content" label="短信内容" min-width="200"></el-table-column>
                    <el-table-column prop="submitTime" label="发送时间" width="160"></el-table-column>
                    <el-table-column prop="describes" label="原因" width="160"></el-table-column>
                    <el-table-column label="黑[白]端口" width="100" align="">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="addRow(scope.row)" plain>添加</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="pagination-wrap" flex="main:right" flex-box="0">
                <vsd-table-pagination :currentPage="page" :total="total" @handleChange="handleCurrentChange"></vsd-table-pagination>
            </div> -->
        </div>
        <el-dialog :visible.sync="dialogFormVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="ban" class="vsd-mr-5 d-color"/>拒发原因 </div>
            <el-form :model="dialogForm" label-position="top" ref="dialogForm">
                <el-form-item label="" prop="speedDesc">
                    <el-select v-model="dialogForm.speedDesc" placeholder="请选择" @change="val=>dialogForm.noPassDescribe = val" style="width:100%">
                        <el-option value="内容不符合要求"></el-option> 
                        <el-option value="营销"></el-option> 
                        <el-option value="内容可能引起投诉"></el-option> 
                        <el-option value="编辑内容涉及非法宣传"></el-option> 
                        <el-option value="涉及非法词汇"></el-option> 
                        <el-option value="内容包含子网址"></el-option> 
                        <el-option value="其他"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="noPassDescribe">
                    <el-input v-model.trim="dialogForm.noPassDescribe" autocomplete="off" type="textarea" placeholder="请输入" maxlength="20" :rows="4" show-word-limit resize="vertical"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDialog" size="small">确 定</el-button>
                <el-button @click="dialogFormVisible = false" type="primary" plain size="small">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogEditVisible" v-if="dialogEditVisible" append-to-body width="500px" class="custom-dialog" :close-on-click-modal="false">
            <div slot="title"> <vsd-icon name="plus" class="vsd-mr-5 m-color"/>添加端口 </div>
            <el-form :model="dialogEditForm" label-width="120px" label-position="left" ref="dialogEditForm">
                <el-form-item label="端口" prop="srcAddr" :rules="{ required: true, message: '请输入端口', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.srcAddr" disabled placeholder="请输入端口" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="客户名称" prop="corpName" :rules="{ required: true, message: '请输入客户名称', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.corpName" disabled placeholder="请输入客户名称" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="端口类型" prop="portType" :rules="{ required: true, message: '请输入端口类型', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.portType">
                        <el-radio :label="0">省内端口</el-radio>
                        <el-radio :label="1">外省端口</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="发送权限" prop="filterType" :rules="{ required: true, message: '请输入发送权限', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.filterType">
                        <el-radio :label="2">白名单</el-radio>
                        <el-radio :label="1">黑名单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="过滤黑名单用户" prop="filterBlackUser" v-if="dialogEditForm.filterType === 2" :rules="{ required: true, message: '请选择过滤黑名单用户', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.filterBlackUser">
                        <el-radio :label="0">需要</el-radio>
                        <el-radio :label="1">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="过滤关键字" prop="filterKeyword" v-if="dialogEditForm.filterType === 2" :rules="{ required: true, message: '请选择过滤关键字', trigger: 'change' }">
                    <el-radio-group v-model="dialogEditForm.filterKeyword">
                        <el-radio :label="0">需要</el-radio>
                        <el-radio :label="1">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="describes">
                    <el-input v-model.trim="dialogEditForm.describes"  placeholder="请输入备注" show-word-limit></el-input>
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
	data(){
		return {
            date:[],
			formInline:{
                corpName:'',
                srcAddr:'',
                beginTime:'',
                endTime:'',
                msisdn:'',
                query:0,
			},
			dialogFormVisible:false,
			dialogForm:{
				noPassDescribe:'',
				speedDesc:'',
			},
            dialogEditForm:{
                srcAddr:'',
                corpName:'',
                portType:'',
                filterType:'',
                filterBlackUser:'',
                filterKeyword:'',
                describes:'',
            },
            dialogEditVisible:false,
			tableData:[],
			multipleSelection:[],
            rowId:'',
            waitMsgNum:0,
		}
	},
    filters:{
    },
	mixins:[pagination,storeData],
	components: {},
	created() {
        // if(!this.hasDataCache) this.date =[moment().subtract(30, 'days').format('yyyy-MM-DD HH:mm:ss'),moment().format('yyyy-MM-DD HH:mm:ss')]
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
        exoprtList(){
            window.location.href=process.env.VUE_APP_APR+'/exportCheckSms';
        },
        rowPassHandle(row){
            this.$confirm('确认审核通过？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				const ids = row ? row.sourceId : this.multipleSelection.map(item=>item.sourceId).join(',');
				this.$api.checkSms({id:ids,checkType:'1'}).then( res => { 
                    this.$message({message: '操作成功', type: 'success'});
                    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{})
        },
        rowRefuseHandle(row){
            this.dialogFormVisible = true
            this.dialogForm.speedDesc = ''
            this.dialogForm.noPassDescribe = ''
            this.rowId = row ? row.sourceId : this.multipleSelection.map(item=>item.sourceId).join(',')
        },
        searchList(){
            this.page = 1
            this.formInline.query = 2
            this.queryList()
        },
        initList(){
            this.page = 1
            this.formInline.query = 1
            this.queryList()
        },
		queryList(){
            this.tableData = []
			this.$api.smsCheckList({...this.formInline,page:this.page}).then( res => { 
                 this.tableData = res.info || []
                 this.waitMsgNum = res.waitMsgNum
                 this.total = res.total
                 this.formInline.query = 2
			}).catch(error=>{
				console.log(error)
			})
		},
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
      	delrow(row){
      		this.$confirm('确认删除吗？', '提示', {
				confirmButtonText: '确定',
                cancelButtonText: '取消',
                center:true,
				iconClass:'el-icon-warning-outline',
				customClass:'custom-message-confirm',
			}).then(() => {
				const ids = row ? row.id : this.multipleSelection.map(item=>item.id).join(',');
				this.$api.deleteSmsTemplate({id:ids}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
  		submitDialog(){
            if(this.dialogForm.noPassDescribe == ''){
                return this.$message.warning('请输入不通过原因')
            }
            this.$api.checkSms({id:this.rowId,noPassDescribe:this.dialogForm.noPassDescribe,checkType:'2'}).then( res => { 
                this.$message({message: '操作成功', type: 'success'});
                this.searchList();
                this.dialogFormVisible = false; 
            }).catch(error=>{})
		},
        addRow(row){
            this.dialogEditForm.srcAddr = row.srcAddr
            this.dialogEditForm.corpName = row.corpName
            this.dialogEditVisible = true
        },
        submitEditDialog(){
            this.$refs.dialogEditForm.validate((valid) => {
                if (valid) {
                    this.$api.addPort(this.dialogEditForm).then( res => {
                        this.$message.success(`添加成功`)
                        this.searchList()
                        this.dialogEditVisible = false
                    }).catch(error=>{})
                } else {
                    return false;
                }
            });
        }
	}
}
</script>
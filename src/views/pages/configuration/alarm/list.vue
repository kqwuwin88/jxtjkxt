<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="姓名" v-model.trim="formInline.realName" />
                </el-form-item>
                <el-form-item label="">
                    <el-input placeholder="手机号码" v-model.trim="formInline.msisdn" />
                </el-form-item>
                <!-- <el-form-item label="">
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
                </el-form-item> -->
                <el-form-item label="">
                    <el-button type="primary" @click="searchList" icon="el-icon-search">查询</el-button>
                    <el-button type="primary" @click="addRow()" icon="el-icon-plus">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content-list-wrap" flex="dir:top" flex-box="1">
            <div class="table-wrap" flex-box="1">
                <el-table :data="tableData" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column prop="realName" label="姓名" width=""></el-table-column>
                    <el-table-column prop="msisdn" label="手机号码" width=""></el-table-column>
                    <el-table-column prop="alarmType" label="告警类型" width="">
                        <template slot-scope="scope">
                            {{scope.row.alarmType | filterAlarmType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUser" label="创建者" width=""></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
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
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改告警用户' : '添加告警用户'}} </div>
            <el-form :model="dialogEditForm" label-width="120px" label-position="left" ref="dialogEditForm">
                <el-form-item label="姓名" prop="realName" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.realName" placeholder="请输入姓名" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="msisdn" :rules="{ required: true, message: '请输入手机号码', trigger: 'blur' }">
                    <el-input v-model.trim="dialogEditForm.msisdn" placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="告警类别" prop="alarmType" :rules="{ required: true, message: '请选择告警类别', trigger: 'change' }">
                    <el-checkbox-group v-model="dialogEditForm.alarmType">
                        <el-checkbox label="1001">系统级告警</el-checkbox>
                        <el-checkbox label="1003">业务级告警</el-checkbox>
                    </el-checkbox-group>
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
                realName:'',
                msisdn:'',
			},
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                realName:'',
                msisdn:'',
                alarmType:[],
                remark:'',
                id:''
            },
		}
	},
    filters:{
        filterAlarmType(val){
            return val.replace('1001','系统级告警').replace('1003','业务级告警')
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
                this.$api.getAlarmUser({id:row.id}).then( res => { 
                    const alarmType = res.info.alarmType.split(',')
                    this.dialogEditForm = res.info
                    this.dialogEditForm.alarmType = alarmType
                    this.dialogEditVisible = true
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                for (const key in this.dialogEditForm) {
                    this.dialogEditForm[key] = ''
                }
                this.dialogEditForm.alarmType = []
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
                    const url = this.dialogEditForm.id ? 'modifyAlarmUser' : 'addAlarmUser'
                    const sendData = cloneDeep(this.dialogEditForm)
                    sendData.alarmType = this.dialogEditForm.alarmType.join(',')
                    this.$api[url](sendData).then( res => {
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
				this.$api.deleteAlarmUser({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.alarmUserList({...this.formInline,page:this.page}).then( res => { 
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
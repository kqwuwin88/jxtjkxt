<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="toolbar-lay" flex-box="0">
            <el-form inline :model="formInline">
                <el-form-item label="">
                    <el-input placeholder="模板内容" v-model.trim="formInline.keyWord" />
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
                <el-table :data="tableData" v-if="refresh" :row-class-name="rowClass" class="table-border" ref="multipleTable" height="100%">
                    <el-table-column width="50px">
                        <template slot-scope="scope">
                            <span @click="plusEdit(scope.row)" class="point"><vsd-icon :name="scope.row.show ? 'minus-square-o' : 'plus-square-o'" class="m-color"/></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="模板内容" min-width="180px"></el-table-column>
                    <el-table-column prop="staffId" label="创建者" width="150px"></el-table-column>
                    <el-table-column prop="addTime" label="创建时间" width="160px"></el-table-column>
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
            <div slot="title"> <vsd-icon :name="this.dialogEditForm.id ? 'edit' : 'plus'" class="vsd-mr-5 m-color"/>{{this.dialogEditForm.id ? '修改模板' : '添加模板'}} </div>
            <el-form :model="dialogEditForm" ref="dialogEditForm">
                <el-form-item label="" prop="content" :rules="{ required: true, message: '请输入模板内容', trigger: 'blur' }">
                    <el-input type="textarea" ref="areaSms" :autosize="{ minRows: 5, maxRows: 10 }" v-model.trim="dialogEditForm.content" placeholder="请输入模板内容" show-word-limit></el-input>
                </el-form-item>
                <el-button type="primary" @click="addVariable" size="small">插入变量</el-button>
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
                keyWord:'',
                beginTime:'',
                endTime:'',
			},
            refresh:true,
            rowClass:(scope)=>{
                return scope.row.show + '_tag'
            },
			tableData:[],
            dialogEditVisible:false,
            dialogEditForm:{
                content:'',
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
        addVariable(){
            this.dialogEditForm.content += '【变量】'
            this.$refs.areaSms.focus()
        },
        plusEdit(row){
            this.refresh = false
            row.show = !row.show
            this.$nextTick(()=>{
                this.refresh = true
            })
        },
        addRow(row){
            if(row){
                this.$api.getSmsTemplate({id:row.id}).then( res => { 
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
                    const url = this.dialogEditForm.id ? 'modifySmsTemplate' : 'addSmsTemplate'
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
				this.$api.deleteSmsTemplate({id:row.id}).then( res => { 
				    this.$message({message: '操作成功', type: 'success'});
				    this.searchList();
				}).catch(error=>{})
			}).catch(()=>{});
      	},
		queryList(){
            this.tableData = []
			this.$api.smsTemplateList({...this.formInline,page:this.page}).then( res => { 
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
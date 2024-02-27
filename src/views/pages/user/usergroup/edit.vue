<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-title-mrr" flex-box="0"><span>{{isEdit ? '修改用户组' : '添加用户组'}}</span></div>
        <div style="overflow:auto" flex-box="1">
            <el-checkbox-group v-model="formView.rights" flex-box="1">
                <el-form ref="form" flex-box="1" class="view-box-mrr view-form-mrr" :model="formView" label-width="220px" label-position="left">
                    <el-form-item label="组名称" prop="groupName" :rules="{ required: true, message: '请输入组名称', trigger: 'blur' }">
                        <el-input v-model="formView.groupName" placeholder="请输入组名称" maxlength="30" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="所属类别" prop="groupType" :rules="{ required: true, message: '请选择所属类别', trigger: 'change' }">
                        <el-radio-group v-model="formView.groupType">
                            <el-radio :label="1">业务组</el-radio>
                            <el-radio :label="2">安全组</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="formView.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                    <el-form-item label="" label-width="0" class="no-label-wrap">权限</el-form-item>
                    <el-form-item prop="remark" v-for="rightItem in allRights" :key="rightItem.order">
                        <div slot="label"><span class="vsd-mr-10">{{rightItem.name}}</span><el-switch v-model="rightItem.switch" active-color="#03ccbb" @change="val => changeSwitch(val,rightItem.list)"></el-switch></div>
                        <el-checkbox :label="item.right" v-for="item in rightItem.list" :key="item.right">{{item.name}}</el-checkbox>
                    </el-form-item>
                </el-form>
            </el-checkbox-group>
        </div>
        <div flex-box="0" class="view-bot-op">
            <el-button type="default" @click="closeAndGoback">取消</el-button>
            <el-button type="primary" @click="submitView">保存</el-button>
        </div>
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import moment from 'moment'
import { uniq,difference } from 'lodash'
export default {
	data(){
		return {
			formView:{
                groupName:'',
                groupType:'',
                remark:'',
                rights:[]
			},
            allRights:'',
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {},
	created() {
        this.queryAllRights()
        this.queryListInfo()
	},
  	watch: {
    },
  	computed: {
        isEdit(){
            return !!this.$route.query.id
        }
    },
	mounted(){

    },
	methods:{
        changeSwitch(val,list){
            if(val){
                this.formView.rights = uniq([...this.formView.rights,...list.map(item=>item.right)])
            }else{
                this.formView.rights = difference(this.formView.rights,list.map(item=>item.right))
            }
        },
        submitView(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.isEdit){
                        this.$api.modifyUserGroup({...this.formView,rights:this.formView.rights.join(',')}).then( res => { 
                            this.$message.success('操作成功')
                            this.closeAndGoback()
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else{
                        this.$api.addUserGroup({...this.formView,rights:this.formView.rights.join(',')}).then( res => { 
                            this.$message.success('操作成功')
                            this.closeAndGoback()
                        }).catch(error=>{
                            console.log(error)
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        queryAllRights(){
            this.$api.getMenu().then( res => { 
                const resData = JSON.parse(res.menu)
                this.allRights = resData.map(item=>{
                    item.switch = true
                    return item
                })
            }).catch(error=>{
                console.log(error)
            })
        },
        queryListInfo(){
            const id = this.$route.query.id
            if(id){
                this.$api.getUserGroup({id}).then( res => { 
                    if(this.hasDataCache){
                    }else{
                        this.formView = res.info
                        this.formView.rights = uniq(res.info.rights.split(',').map(item=>item.trim()))
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
	}
}
</script>
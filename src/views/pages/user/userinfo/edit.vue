<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-title-mrr" flex-box="0"><span>{{isEdit ? '修改用户信息' : '添加用户信息'}}</span></div>
        <div style="overflow:auto" flex-box="1">
            <el-form ref="form" flex-box="1" class="view-box-mrr view-form-mrr" :model="formView" label-width="160px" label-position="left">
                <el-form-item label="账号" prop="userName" :rules="{ required: true, message: '请输入账号', trigger: 'blur' }">
                    <el-input v-model="formView.userName" :disabled="isEdit" placeholder="请输入账号" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="!isEdit" prop="password" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
                    <el-input v-model="formView.password" placeholder="请输入密码" maxlength="20" show-word-limit></el-input>
                    <span class="form-item-trans">注 : 密码须包含字母、数字及特殊字符(如*&@#等)，长度为8~14位</span>
                </el-form-item>
                <el-form-item label="再次输入密码" v-if="!isEdit" prop="passwordSure" :rules="{ required: true, trigger: 'blur',validator: ruleRepsd }">
                    <el-input v-model="formView.passwordSure" placeholder="请输入密码" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="msisdn" :rules="{ required: true, message: '请输入手机号码', trigger: 'blur' }">
                    <el-input v-model="formView.msisdn" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入手机号码" maxlength="11" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="用户类别" prop="userType" :rules="{ required: true, message: '请选择用户类别', trigger: 'change' }">
                    <el-radio-group v-model="formView.userType">
                        <el-radio :label="0">普通用户</el-radio>
                        <el-radio :label="1">管理员</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">注:管理员可查看审核日志中的手机号码及短信内容，普通用户无权查看</span>
                </el-form-item>
                <el-form-item label="所属部门" prop="depId" :rules="{ required: true, message: '请选择所属部门', trigger: 'change' }">
                    <el-select v-model="formView.depId" placeholder="所属部门">
                        <el-option :label="item.departmentName" :value="item.id" :key="item.id" v-for="item in depList"></el-option> 
                    </el-select>
                </el-form-item>
                <el-form-item label="用户组" prop="groupId" :rules="{ required: true, message: '请选择用户组', trigger: 'change' }">
                    <el-select v-model="formView.groupId" placeholder="用户组">
                        <el-option :label="item.groupName" :value="item.id" :key="item.id" v-for="item in groupList"></el-option> 
                    </el-select>
                </el-form-item>
            </el-form>
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
import CryptoJS from 'crypto-js'
import { cloneDeep } from 'lodash'
export default {
	data(){
		return {
            pageInfo:{},
			formView:{
                userName:'',
                password:'',
                passwordSure:'',
                msisdn:'',
                userType:'',
                depId:'',
                groupId:'',
			},
            ruleRepsd: (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入'));
                } else if (value !== this.formView.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            },
            depList:[],
            groupList:[],
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {},
	async created() {
        await this.queryInfo()
        await this.queryListInfo()
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
        queryInfo(){
            this.$api.getLoginInfo().then(res=>{
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
        submitView(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.isEdit){
                        this.$api.modifyAdmin(this.formView).then( res => { 
                            this.$message.success('操作成功')
                            this.closeAndGoback()
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else{
                        const sendData = cloneDeep(this.formView)
                        sendData.password = this.Encrypt(sendData.password)
                        sendData.userName = this.Encrypt(sendData.userName)
                        delete sendData.passwordSure
                        this.$api.addAdmin(sendData).then( res => { 
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
        queryListInfo(){
            const id = this.$route.query.id
            if(id){
                this.$api.toModifyAdmin({id:id}).then( res => { 
                    if(this.hasDataCache){
                    }else{
                        this.formView = res.info
                    }
                    this.groupList = res.groupList
                    this.depList = res.depList
                }).catch(error=>{
                    console.log(error)
                })
            }else{
                this.$api.toAddAdmin({sysId:id}).then( res => { 
                    this.groupList = res.groupList
                    this.depList = res.depList
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
	}
}
</script>
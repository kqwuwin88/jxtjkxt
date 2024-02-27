<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-title-mrr" flex-box="0"><span>修改网关信息</span></div>
        <div style="overflow:auto" flex-box="1">
            <el-form ref="form" flex-box="1" class="view-box-mrr view-form-mrr" :model="formView" label-width="200px" label-position="left">
                <el-form-item label="账号" prop="entCode" :rules="{ required: true, message: '请输入账号', trigger: 'blur' }">
                    <el-input v-model="formView.entCode" placeholder="请输入账号"></el-input>
                    <span class="form-item-trans">行业网关登录账号</span>
                </el-form-item>
                <el-form-item label="密码" prop="password" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
                    <el-input v-model="formView.password" placeholder="请输入密码"></el-input>
                    <span class="form-item-trans">行业网关登录密码</span>
                </el-form-item>
                <el-form-item label="最大连接数" prop="smslinkCount" :rules="{ required: true, message: '请输入最大连接数', trigger: 'blur' }">
                    <el-input v-model="formView.smslinkCount" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入最大连接数"></el-input>
                    <span class="form-item-trans">允许行业网关最大连接数</span>
                </el-form-item>
                <el-form-item label="心跳间隔时间" prop="smssharkTime" :rules="{ required: true, message: '请输入心跳间隔时间', trigger: 'blur' }">
                    <el-input v-model="formView.smssharkTime" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入心跳间隔时间"></el-input>
                    <span class="form-item-trans">行业网关连接心跳间隔时间</span>
                </el-form-item>
                <el-form-item label="连接超时时间" prop="smsayncTimeOut" :rules="{ required: true, message: '请输入连接超时时间', trigger: 'blur' }">
                    <el-input v-model="formView.smsayncTimeOut" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入连接超时时间"></el-input>
                    <span class="form-item-trans">行业网关连接超时时间</span>
                </el-form-item>
                <el-form-item label="当前状态" prop="status" :rules="{ required: true, message: '请选择当前状态', trigger: 'change' }">
                    <el-radio-group v-model="formView.status">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">关闭</el-radio>
                    </el-radio-group>
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
export default {
	data(){
		return {
			formView:{
                entCode:'',
                password:'',
                smslinkCount:'',
                smssharkTime:'',
                smsayncTimeOut:'',
                status:'',
			},
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {},
	created() {
        this.queryView()
	},
  	watch: {
    },
  	computed: {
    },
	mounted(){

    },
	methods:{
        submitView(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$api.modifyIsmg(this.formView).then( res => { 
                        this.$message.success('操作成功')
                        this.queryView()
                    }).catch(error=>{
                        console.log(error)
                    })
                } else {
                    return false;
                }
            });
        },
        queryView(){
            this.$api.getIsmg({}).then( res => { 
                if(this.hasDataCache){
                }else{
                    this.formView = res.info
                }
            }).catch(error=>{
                console.log(error)
            })
        },
	}
}
</script>
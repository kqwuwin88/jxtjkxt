<template>
    <div class="init-content-lay content-page-view" flex="dir:top">
        <div class="edit-title-mrr" flex-box="0"><span>系统配置</span></div>
        <div style="overflow:auto" flex-box="1">
            <el-form ref="form" flex-box="1" class="view-box-mrr view-form-mrr" :model="formView" label-width="200px" label-position="left">
                <el-form-item label="默认处理方式" prop="defaultCheckStatus" :rules="{ required: true, message: '请选择默认处理方式', trigger: 'change' }">
                    <el-radio-group v-model="formView.defaultCheckStatus">
                        <el-radio :label="0">需要审核</el-radio>
                        <el-radio :label="1">直接发送</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">针对未配置端口或签名的客户，平台所采用的处理方式。</span>
                </el-form-item>
                <el-form-item label="过滤黑名单用户" prop="defaultFilterBlackUser" :rules="{ required: true, message: '请选择过滤黑名单用户', trigger: 'change' }">
                    <el-radio-group v-model="formView.defaultFilterBlackUser">
                        <el-radio :label="0">需要</el-radio>
                        <el-radio :label="1">不需要</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">针对未配置端口或签名的客户，平台是否需要过滤黑名单号码。</span>
                </el-form-item>
                <el-form-item label="过滤关键字" prop="defaultFilterKeyword" :rules="{ required: true, message: '请选择过滤关键字', trigger: 'change' }">
                    <el-radio-group v-model="formView.defaultFilterKeyword">
                        <el-radio :label="0">需要</el-radio>
                        <el-radio :label="1">不需要</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">针对未配置端口或签名的客户，平台是否需要按关键字进行拦截。</span>
                </el-form-item>
                <el-form-item label="自动审核" prop="autoCheck" :rules="{ required: true, message: '请选择自动审核', trigger: 'change' }">
                    <el-radio-group v-model="formView.autoCheck">
                        <el-radio :label="0">关闭</el-radio>
                        <el-radio :label="1">开启</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">针对已经审核过的短信，后续出现相同内容时是否自动按人工审核的结果进行处理。</span>
                </el-form-item>
                <el-form-item label="自动审核方式" prop="autoCheckType" :rules="{ required: true, message: '请选择自动审核方式', trigger: 'change' }">
                    <el-radio-group v-model="formView.autoCheckType">
                        <el-radio :label="0">仅内容</el-radio>
                        <el-radio :label="1">主叫+内容</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">当开启自动审核时，系统的判断依据。</span>
                </el-form-item>
                <el-form-item label="自动审核有效期" prop="autoCheckOverDay" :rules="{ required: true, message: '请输入自动审核有效期', trigger: 'blur' }">
                    <el-input v-model="formView.autoCheckOverDay" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入自动审核有效期"></el-input><span class="d-color">天</span>
                    <span class="form-item-trans">内容在有效期内，系统将按人工审核结果进行处理。</span>
                </el-form-item>
                <el-form-item label="门户审核时间" prop="checkOverTime" :rules="{ required: true, message: '请输入门户审核时间', trigger: 'blur' }">
                    <el-input v-model="formView.checkOverTime" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入门户审核时间"></el-input><span class="d-color">秒</span>
                    <span class="form-item-trans">查出待审核短信后，若在指定时间内未进行审核操作，则系统将自动回收。</span>
                </el-form-item>
                <el-form-item label="审核超时时间" prop="smsOverTime" :rules="{ required: true, message: '请输入审核超时时间', trigger: 'blur' }">
                    <el-input v-model="formView.smsOverTime" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入审核超时时间"></el-input><span class="d-color">秒</span>
                    <span class="form-item-trans">超时未审核的短信，系统将根据相关配置，自动进行发送、拒发等操作。</span>
                </el-form-item>
                <el-form-item label="待审核消息上限" prop="waitNumMax" :rules="{ required: true, message: '请输入待审核消息上限', trigger: 'blur' }">
                    <el-input v-model="formView.waitNumMax" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入待审核消息上限"></el-input><span class="d-color">条</span>
                    <span class="form-item-trans">待审核消息的数量超出该值，则发送告警短信。</span>
                </el-form-item>
                <el-form-item label="晚间模式" prop="nightModel" :rules="{ required: true, message: '请选择晚间模式', trigger: 'change' }">
                    <el-radio-group v-model="formView.nightModel">
                        <el-radio :label="0">关闭</el-radio>
                        <el-radio :label="1">开启</el-radio>
                    </el-radio-group>
                    <span class="form-item-trans">若开启晚间模式，系统则按所配置的晚间模式处理。</span>
                </el-form-item>
                <el-form-item label="晚间时间" required>
                    <div class="vsd-fl wid300" flex>
                        <el-form-item prop="nightBeginTime" label="" :rules="{ required: true, message: '请输入起始日期', trigger: 'blur' }" class="init_form_content">
                            <el-time-picker placeholder="选择日期" v-model="formView.nightBeginTime" value-format="HH:mm:ss" style="width:100%"></el-time-picker>
                        </el-form-item>
                        <span class="line">-</span>
                        <el-form-item prop="nightEndTime" label="" :rules="{ required: true, message: '请输入截止日期', trigger: 'blur' }" class="init_form_content">
                            <el-time-picker placeholder="选择日期" v-model="formView.nightEndTime" value-format="HH:mm:ss" style="width:100%"></el-time-picker>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="晚间处理方式" prop="nightCheckType" :rules="{ required: true, message: '请选择晚间处理方式', trigger: 'change' }">
                    <el-radio-group v-model="formView.nightCheckType">
                        <el-radio :label="0">审核</el-radio>
                        <el-radio :label="1">免审</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="告警账号" prop="alarmAccount" :rules="{ required: true, message: '请输入告警账号', trigger: 'blur' }">
                    <el-input v-model="formView.alarmAccount" placeholder="请输入告警账号"></el-input>
                </el-form-item>
                <el-form-item label="告警端口" prop="alarmSrcAddr" :rules="{ required: true, message: '请输入告警端口', trigger: 'blur' }">
                    <el-input v-model="formView.alarmSrcAddr" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入告警端口"></el-input>
                </el-form-item>
                <el-form-item label="告警签名" prop="signName" :rules="{ required: true, message: '请输入告警签名', trigger: 'blur' }">
                    <el-input v-model="formView.signName" placeholder="请输入告警签名"></el-input>
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
                defaultCheckStatus:'',
                defaultFilterBlackUser:'',
                defaultFilterKeyword:'',
                autoCheck:'',
                autoCheckType:'',
                autoCheckOverDay:'',
                checkOverTime:'',
                smsOverTime:'',
                waitNumMax:'',
                nightModel:'',
                nightBeginTime:'',
                nightEndTime:'',
                nightCheckType:'',
                alarmAccount:'',
                alarmSrcAddr:'',
                signName:'',
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
                    this.$api.modifySysConfig(this.formView).then( res => { 
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
            this.$api.getSysConfig({}).then( res => { 
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
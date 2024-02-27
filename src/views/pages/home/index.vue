<template>
    <div class="init-content-lay" flex="dir:top">
        <div class="content-chart-wrap" flex-box="1">
            <div class="chart-left" flex="dir:top" style="height:50%;margin-bottom:10px">
                <div class="title" flex-box="0"><span>数据统计【按时间】</span></div>
                <div flex-box="0" flex="main:right" class="vsd-pr-20" style="margin-top:-20px;">
                    <el-radio-group v-model="timeType" @change="indexFlowOfTime">
                        <el-radio-button :label="0">24h</el-radio-button>
                        <el-radio-button :label="1">日</el-radio-button>
                        <el-radio-button :label="2">月</el-radio-button>
                    </el-radio-group>
                </div>
                <div flex-box="1">
                    <v-chart :options="options" :autoresize="true" style="width:100%;height:100%;"/>
                </div>
            </div>
            <el-row :gutter="20" style="height:50%">
                <el-col :span="9">
                    <div class="chart-left" flex="dir:top">
                        <div class="title" flex-box="0"><span>今日短信流量【按行业】</span></div>
                        <div flex-box="1">
                            <homePie :barData="pieData1" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="15">
                    <div class="chart-left" flex="dir:top">
                        <div class="title" flex-box="0"><span>今日短信流量【按省份】</span></div>
                        <div flex-box="1">
                            <homeBar :barData="pieData2" />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        
    </div>
</template>
<script>
import storeData from '@/mixins/storeData'
import homePie from '@/components/home-pie'
import homeBar from '@/components/home-bar'

export default {
	data(){
		return {
			formInline:{
                dates:'',
			},
            timeType:0,
            options:{
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f0f0f0'
                        }
                    },
                    axisLabel:{
                        color:'#333',
                        overflow:'truncate',
                        width:120,
                        rotate:30
                    },
                    axisLine:{
                        lineStyle:{
                            color:'f0f0f0'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    top:30,
                    bottom:0,
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    name: '单位：万',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#f0f0f0'
                        }
                    },
                    minInterval: 10000,
                    axisLabel:{
                        formatter: function (value, index) {
                            return (value/10000);
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'f0f0f0'
                        }
                    }
                },
                tooltip:{
                    trigger: 'axis',
                    valueFormatter: (value) => (value ? (value/10000).toFixed(2) : 0) + '万',
                    axisPointer:{
                        lineStyle:{
                            width:2,
                            color:'#bcebe4'
                        }
                    }
                    
                },
                color:['#2872b6'],
                series: {
                    data: [],
                    type: 'line',
                    symbolSize: 8,
                    lineStyle:{
                        width:1,
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#60e6d4' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }
            },
			tableData:[],
            pieData1:[],
            pieData2:[],
		}
	},
    filters:{
    },
	mixins:[storeData],
	components: {homePie,homeBar},
	created() {
        this.indexFlowOfTime().then((res)=>{
            if(res){
                this.indexFlowOfIndustry()
                this.indexFlowOfProvince()
            }
        })
	},
  	watch: {
    },
  	computed: {},
	mounted(){},
	methods:{
        indexFlowOfTime(){
            return this.$api.indexFlowOfTime({timeType:this.timeType}).then( res => { 
                if(res.info){
                    this.options.xAxis.data = res.info.map(item=>item.statistDate)
                    this.options.series.data = res.info.map(item=>item.totalNum)
                }else{
                    this.options.xAxis.data = []
                    this.options.series.data = []
                }
                return res
			}).catch(error=>{
				console.log(error)
			})
        },
        indexFlowOfIndustry(){
            return this.$api.indexFlowOfIndustry({}).then( res => { 
                this.pieData1 = res.info
                return res
			}).catch(error=>{
				console.log(error)
			})
        },
        indexFlowOfProvince(){
            return this.$api.indexFlowOfProvince({}).then( res => { 
                this.pieData2 = res.info
			}).catch(error=>{
				console.log(error)
			})
        },
	}
}
</script>
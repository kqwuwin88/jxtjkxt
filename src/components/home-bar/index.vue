<template>
    <v-chart :options="options" ref="mychart" :autoresize="true" style="width:100%;height:100%;"/>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
    props:{
        barData:{
            type:Array,
            default:()=>[],
        }, 
        
    },
	data(){
		return {
            options:{
                xAxis: [{
                    type: 'category',
                    axisLine:{
                        lineStyle:{
                            color:'#d3d3d3'
                        },
                    },
                    axisLabel:{
                        color:'#333',
                        overflow:'truncate',
                        width:120,
                        interval:0,
                        lineHeight:20,
                        rotate:45
                        // rotate:45
                    },
                    axisTick:{
                        show:false
                    },
                    data: []
                }],
               
                yAxis: [
                    {
                        type: 'value',
                        name: '单位：万',
                        axisLine:{
                            show:false,
                        },
                        axisLabel:{
                            formatter: function (value, index) {
                                return (value/10000);
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        splitLine:{
                            lineStyle:{
                                color:['#ededed']
                            }
                        },
                    }
                ],
                tooltip: {
                    valueFormatter: (value) => (value ? (value/10000).toFixed(2) : 0) + '万'
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    containLabel: true
                },
                series: {
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#188df0' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#83bff6' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    },
                    name: `短信统计`,
                    type: 'bar',
                    barWidth: 10,
                    data: []
                }
            },
		}
    },
    computed: {
        
    },
    components:{
    },
    filters:{
    },
  	watch: {
        barData:{
            handler(val){
                this.options.series.data = this.barData.map(item=>item.totalNum)
                this.options.xAxis[0].data = this.barData.map(item=>item.provinceName)
                this.$refs.mychart?.refresh()
            },
            deep:true,
            immediate:true
        }
    },
    created(){
        
    },
	mounted(){},
	methods:{
	}
}
</script>
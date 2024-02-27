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
                        rotate:30
                        // rotate:45
                    },
                    axisTick:{
                        show:false
                    },
                    // data: ['贵州农信', '贵州电网', '贵州农商行', '贵州银行', '贵州移动市场部', '遵义供电局', '贵阳供电局','机场','燃气集团']
                    data: []
                }],
               
                yAxis: [
                    {
                        type: 'value',
                        name: '单位：万',
                        axisLine:{
                            show:false,
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
               /*  legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                }, */
                // color:['#67a8e6','#ff9a6f','#8f8f8f','#ffb605','#ed7a7a','#3db8a2','#a9d5ff','#ffc3a9','#c8c8c8','#ffdc89','#ffaeae','#70e3cf'],
                tooltip: {
                    valueFormatter: (value) => (value ? value.toFixed(2) : 0) + '万'
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    containLabel: true
                },
                series: []
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
                this.options.xAxis[0].data = this.barData.map(item=>item.statistName)
                const aaa = this.getSeriesData(this.barData)
                this.options.series = cloneDeep(aaa)
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
        getSeriesData(data){
            let result = []
            if(this.barData.length === 0) return result
            const bardata = cloneDeep(this.barData)
            bardata.forEach((item,index) => {
                const dataList = item.list
                dataList.forEach((child,i) => {
                    if(result[2*i]){
                        result[2*i].data[index] = (child.intercept)/10000
                        result[2*i + 1].data[index] = (child.totalNum)/10000
                    }else{
                        const data1 = new Array(this.barData.length)
                        data1[index] = (child.intercept)/10000
                        const data2 = new Array(this.barData.length)
                        data2[index] = (child.totalNum)/10000
                        result.push({
                            name: `${child.statistDate}拦截条数`,
                            type: 'bar',
                            barWidth: 10,
                            stack: child.statistDate,
                            data: data1
                        },{
                            name: `${child.statistDate}短信条数`,
                            type: 'bar',
                            barWidth: 10,
                            stack: child.statistDate,
                            data: data2
                        })
                    }
                })
            })
            return result
        },
        queryView(id){
			this.$api.getAnnouncement({id}).then( res => { 
                this.pageVisible = true
                this.viewData.content = res.info.content
                this.viewData.subject = res.info.subject
			}).catch(error=>{})
        },
	}
}
</script>
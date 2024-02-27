<template>
    <v-chart :options="options" :autoresize="true" style="width:100%;height:100%;"/>
</template>

<script>
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
                tooltip: {
                    trigger: 'item',
                    valueFormatter: (value) => (value ? (value/10000).toFixed(2) : 0) + '万'
                },
                title:{
                    //text:'各行业短信\n量占比',
                    text:'短信量占比',
                    left:'center',
                    top:'center'
                },
                series: {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    label: {
                        formatter: '{b}: ({d}%)'
                    },
                    data: [],
                }
            }
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
                this.options.series.data = this.barData.map(item=>({value:item.totalNum,name:item.statistName}))
            },
            immediate:true,
            deep:true
        }
    },
    created(){
    },
	mounted(){},
	methods:{
        
	}
}
</script>
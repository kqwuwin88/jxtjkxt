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
        util:{
            type:String,
            default:'条',
        }, 
    },
	data(){
		return {
            options:{
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}({d}%)'
                },
                title:{
                    text:'各行业短信\n量占比',
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:14,
                        lineHeight:24
                    },
                    left:'center',
                    top:'center'
                },
                series: {
                    type: 'pie',
                    radius: ['45%', '60%'],
                    label: {
                        formatter: '{b}: {c}({d}%)'
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
                const total = this.barData.reduce((a,b) => a + b.totalNum,0)
                this.options.title.text = `共计\n${total}${this.util}`
                this.options.series.data = this.barData.map(item=>({value:item.totalNum,name:item.industryName}))
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
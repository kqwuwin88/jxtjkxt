<template>
	<el-breadcrumb separator="|">
		<el-breadcrumb-item v-for="(item,index) in filterMatched" :key="index">{{item.meta.title}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>
<script>
export default {
    name:'vsd-bread-crumb',
	data(){
		return {

		}
	},
	props:{
		matcheds: {
			type:Array,
			default:()=>[]
		}
	},
	created() {},
  	watch: {},
  	computed: {
          filterMatched(val){
              return this.matcheds.filter(item=>item.meta && item.meta.title)
          }
    },
	mounted(){
	},
	methods:{
	}
}
</script>
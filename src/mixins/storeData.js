export default {
	data() {
		return {
            hasDataCache:false,
        }
	},
	components: {
	},
    created(){
        const rou = this.$store.getters['allstore/menu/curTab']
        const curData = rou.meta[`__store-${this.$route.fullPath}`]
        if(curData){
            Object.assign(this.$data,curData); 
            this.hasDataCache = true
        }else{
            this.hasDataCache = false
        }
    },
    beforeRouteLeave(to,form,next){
        this.setTabMeta(this.$data)
        next()
    },
	methods: {
		setTabMeta(metaform){
            this.$store.commit('allstore/menu/tabEdit', metaform)
        }
	}
}
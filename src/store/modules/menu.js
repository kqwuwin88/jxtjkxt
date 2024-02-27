import { cloneDeep } from 'lodash'
import router from '@/router'
export default {
    namespaced: true,
    state: {
        // 侧栏菜单
        aside: [],
        tabs: [],
    },
    getters:{
        aside:(state)=>state.aside,
        tabs:(state)=>state.tabs,
        curTab:(state)=>{
            const tabs = state.tabs
            const route = router.app._route
            const tab = tabs.find(item=>item.fullPath === route.fullPath)
            if(tab){
                return tab
            }else{
                return null
            }
        },
    },
    actions: {
        
    },
    mutations: {
        /**
         * @description 设置侧边栏菜单
         * @param {Object} state state
         * @param {Array} menu menu setting
         */
        asideSet (state, menu) {
            // store 赋值
            state.aside = menu
        },
        /**
         * @description 设置tab
         * @param {Object} state state
         * @param {Array} menu menu setting
         */
        tabsSet (state, tab) {
            const tabs = state.tabs
            if(tab.fullPath === '/refresh') return
            const hastab = tabs.some(item=>item.fullPath === tab.fullPath)
            if(!hastab){
                if(tab.fullPath === '/home'){
                    state.tabs.unshift(tab)
                }else{
                    state.tabs.push(tab)
                }
            }
        },
        tabReset(state, tab){
            state.tabs = [tab]

        },
        tabCloseAll(state, tab){
            state.tabs = []
        },
        tabCloseWithoutHome(state, tab){
            state.tabs = cloneDeep(state.tabs).filter(item=>item.fullPath === '/home')
        },
        tabEdit (state, params) {
            const route = router.app._route
            const tabs = state.tabs
            const index = tabs.findIndex(item=>item.fullPath === route.fullPath)
            if(index>-1){
                tabs[index].meta[`__store-${route.fullPath}`] = params
            }
        },
        tabRemove(state, index){
            state.tabs.splice(index,1)
        },
        tabRemoveByPath(state, path){
            const index = state.tabs.findIndex(item=>item.fullPath === path)
            state.tabs.splice(index,1)
        },
    }
}

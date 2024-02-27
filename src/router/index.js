import Vue from 'vue'
import VueRouter from 'vue-router'
import {createRoutes,createSides} from '@/libs/creatRouter'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import util from '@/libs/util.js'
import api from '@/api'
// 路由数据
import routes from './routes'
import {homeMenuRoutes} from './routes'
import menuRoutes from './modules'
import store from '@/store/index'
import { cloneDeep } from 'lodash'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)


const createRouter = () => new VueRouter({
    routes,
    mode:'history',
    base:'/antispam2850/'
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

let hasMenus = false
/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (to.path === '/login') {
        hasMenus = false
        next()
    }else if(to.path === '/'){
        next('/login')
    } else {
        const {query,params,name,path,fullPath,meta} = to
        if (hasMenus){
            next()
            store.commit('allstore/menu/tabsSet', {query,params,name,path,fullPath,meta:cloneDeep(meta)});
        } else {
            hasMenus = true
            await store.dispatch('allstore/user/outer', null, { root: true })
            const {rights = '',groupType} = store.getters['allstore/user/info'];
            const asyncSides = createSides(rights,groupType)
            store.commit('allstore/menu/asideSet', asyncSides);
            const asyncRoutes = createRoutes(rights,groupType)
            asyncRoutes.forEach(item=>{
                router.addRoute(item)
            })
            next('/home')
            if(to.path === '/home'){
                store.commit('allstore/menu/tabsSet', {query,params,name,path,fullPath,meta:cloneDeep(meta)});
            }
            
        }
    }
    
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 更改标题
  util.title(to.meta.title)
})

export default router
